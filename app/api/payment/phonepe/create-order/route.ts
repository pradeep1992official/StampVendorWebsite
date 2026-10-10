import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { calculateOrderPrice, DEFAULT_PRICING, PricingConfig } from '@/src/config/pricing';
import { getAdminDb, verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { getPhonePeAccessToken, getPhonePeApiBase, getPhonePeCredentials } from '@/lib/phonepe';
import {
  confirmPaidOrderAndGrantReferral,
  releaseReferralReservation,
  reserveReferralCreditForOrder,
} from '@/lib/referral-admin';
import { calculateReferralCredit } from '@/lib/referral-utils';

function getApplicationUrl(requestOrigin: string): URL | null {
  const configuredUrl = process.env.APP_URL?.trim();
  let appUrl: URL;

  try {
    appUrl = new URL(configuredUrl || requestOrigin);
  } catch {
    return null;
  }

  if (
    (appUrl.protocol !== 'http:' && appUrl.protocol !== 'https:') ||
    appUrl.username ||
    appUrl.password
  ) {
    return null;
  }

  if (appUrl.hostname === '0.0.0.0' || appUrl.hostname === '[::]' || appUrl.hostname === '::') {
    if (process.env.NODE_ENV === 'production') return null;
    appUrl.hostname = 'localhost';
  }

  return appUrl;
}

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!idToken) return NextResponse.json({ error: 'Sign in is required to pay.' }, { status: 401 });

    const appUrl = getApplicationUrl(req.nextUrl.origin);
    if (!appUrl) {
      return NextResponse.json({
        error: 'The payment return URL is not configured. Set APP_URL to the public application URL.',
      }, { status: 503 });
    }

    const decodedToken = await verifyFirebaseIdToken(idToken);
    const body = await req.json();
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : '';
    if (!orderId) return NextResponse.json({ error: 'A valid order reference is required.' }, { status: 400 });

    const db = getAdminDb();
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

    const order = orderSnap.data()!;
    if (order.ownerUid !== decodedToken.uid) return NextResponse.json({ error: 'Order access denied.' }, { status: 403 });
    if (order.payment?.status === 'Paid') return NextResponse.json({ error: 'This order is already paid.' }, { status: 409 });

    const existingReservation = await db.collection('referralReservations').doc(orderId).get();
    const rawRequestedCredits =
      body?.creditAmount ??
      order.payment?.referralCreditApplied ??
      (existingReservation.data()?.status === 'reserved' ? existingReservation.data()?.amount : 0);
    if (
      typeof rawRequestedCredits !== 'number' ||
      !Number.isSafeInteger(rawRequestedCredits) ||
      rawRequestedCredits < 0
    ) {
      return NextResponse.json({ error: 'Referral credit must be a non-negative whole number.' }, { status: 400 });
    }

    const previousAttemptAge = Date.now() - Number(order.payment?.phonepeInitiatedAt);
    let previousReturnUrlMatches = false;
    if (typeof order.payment?.phonepeReturnUrl === 'string') {
      try {
        const previousReturnUrl = new URL(order.payment.phonepeReturnUrl);
        previousReturnUrlMatches =
          previousReturnUrl.origin === appUrl.origin &&
          previousReturnUrl.pathname === '/payment/phonepe/return';
      } catch {
        previousReturnUrlMatches = false;
      }
    }
    if (
      order.payment?.status === 'Pending' &&
      typeof order.payment?.phonepeMerchantOrderId === 'string' &&
      typeof order.payment?.phonepeRedirectUrl === 'string' &&
      Number(order.payment?.referralCreditApplied || 0) === rawRequestedCredits &&
      previousReturnUrlMatches &&
      Number.isFinite(previousAttemptAge) &&
      previousAttemptAge >= 0 &&
      previousAttemptAge < 20 * 60 * 1000
    ) {
      return NextResponse.json({
        available: true,
        redirectUrl: order.payment.phonepeRedirectUrl,
        merchantOrderId: order.payment.phonepeMerchantOrderId,
        initiatedAt: order.payment.phonepeInitiatedAt,
        creditApplied: rawRequestedCredits,
        amountDue: order.payment.amount,
      });
    }

    const pricingSnap = await db.collection('settings').doc('pricing').get();
    const savedPricing = pricingSnap.data() ?? {};
    const pricing: PricingConfig = {
      stamp100Chennai: typeof savedPricing.stamp100Chennai === 'number' ? savedPricing.stamp100Chennai : DEFAULT_PRICING.stamp100Chennai,
      stamp100TamilNadu: typeof savedPricing.stamp100TamilNadu === 'number' ? savedPricing.stamp100TamilNadu : DEFAULT_PRICING.stamp100TamilNadu,
      stamp200Chennai: typeof savedPricing.stamp200Chennai === 'number' ? savedPricing.stamp200Chennai : DEFAULT_PRICING.stamp200Chennai,
      stamp200TamilNadu: typeof savedPricing.stamp200TamilNadu === 'number' ? savedPricing.stamp200TamilNadu : DEFAULT_PRICING.stamp200TamilNadu,
      notaryExtraFee: typeof savedPricing.notaryExtraFee === 'number' ? savedPricing.notaryExtraFee : DEFAULT_PRICING.notaryExtraFee,
    };
    const terms = order.agreementTerms ?? {};
    const price = calculateOrderPrice(
      pricing,
      terms.stampPaperDenomination === 200 ? 200 : 100,
      terms.deliveryLocation === 'Within Tamil Nadu' ? 'Within Tamil Nadu' : 'Within Chennai',
      Boolean(terms.includeNotary),
    );
    const walletSnapshot = rawRequestedCredits > 0
      ? await db.collection('referralAccounts').doc(decodedToken.uid).get()
      : null;
    const balance = Number(walletSnapshot?.data()?.balance || 0);
    const creditApplied = calculateReferralCredit(rawRequestedCredits, balance, price.totalPayable);
    if (creditApplied < 0 || creditApplied !== rawRequestedCredits) {
      return NextResponse.json({
        error: rawRequestedCredits > price.totalPayable
          ? 'Referral credit cannot exceed this order’s checkout total.'
          : 'Your available referral credit changed. Refresh the balance and try again.',
      }, { status: 409 });
    }

    try {
      await reserveReferralCreditForOrder(orderId, decodedToken.uid, creditApplied);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not reserve referral credit.';
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const amountDue = price.totalPayable - creditApplied;
    if (amountDue === 0) {
      await confirmPaidOrderAndGrantReferral(orderId, {
        paymentUpdates: {
          'payment.gateway': 'ReferralCredit',
          'payment.amount': 0,
          'payment.totalBeforeCredits': price.totalPayable,
          'payment.referralCreditApplied': creditApplied,
        },
      });
      const paidOrder = await orderRef.get();
      return NextResponse.json({
        available: true,
        paid: true,
        creditApplied,
        amountDue: 0,
        order: paidOrder.data(),
      });
    }

    const credentials = getPhonePeCredentials();
    if (!credentials) {
      await releaseReferralReservation(orderId);
      return NextResponse.json({
        available: false,
        error: 'Online payment is not configured yet. Your order is saved; please contact the vendor desk or retry after setup.',
      }, { status: 503 });
    }

    const amount = Math.round(amountDue * 100);
    const merchantOrderId = `TN${Date.now()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const initiatedAt = Date.now();
    const redirectUrl = new URL('/payment/phonepe/return', appUrl.origin);
    redirectUrl.searchParams.set('orderId', orderId);
    redirectUrl.searchParams.set('paymentStartedAt', String(initiatedAt));

    let paymentResponse: Response;
    try {
    const accessToken = await getPhonePeAccessToken(credentials);
    paymentResponse = await fetch(`${getPhonePeApiBase(credentials.production)}/checkout/v2/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        merchantOrderId,
        amount,
        expireAfter: 1200,
        metaInfo: { udf1: orderId },
        paymentFlow: {
          type: 'PG_CHECKOUT',
          merchantUrls: { redirectUrl: redirectUrl.toString() },
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    } catch (error) {
      await releaseReferralReservation(orderId);
      throw error;
    }

    let paymentData: Record<string, unknown>;
    try {
      paymentData = await paymentResponse.json();
    } catch (error) {
      await releaseReferralReservation(orderId);
      throw error;
    }
    const checkoutUrl = typeof paymentData.redirectUrl === 'string'
      ? paymentData.redirectUrl
      : typeof paymentData.redirect_url === 'string'
        ? paymentData.redirect_url
        : '';
    if (!paymentResponse.ok || !checkoutUrl) {
      await releaseReferralReservation(orderId);
      console.error('PhonePe checkout creation failed:', paymentData.code ?? paymentResponse.status);
      return NextResponse.json({ error: 'Secure checkout could not start. Please retry.' }, { status: 502 });
    }

    await orderRef.update({
      'payment.gateway': 'PhonePe',
      'payment.status': 'Pending',
      'payment.amount': amountDue,
      'payment.totalBeforeCredits': price.totalPayable,
      'payment.referralCreditApplied': creditApplied,
      'payment.phonepeMerchantOrderId': merchantOrderId,
      'payment.phonepeMerchantOrderIds': FieldValue.arrayUnion(merchantOrderId),
      'payment.phonepeRedirectUrl': checkoutUrl,
      'payment.phonepeInitiatedAt': initiatedAt,
      'payment.phonepeReturnUrl': redirectUrl.toString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      available: true,
      redirectUrl: checkoutUrl,
      merchantOrderId,
      initiatedAt,
      creditApplied,
      amountDue,
    });
  } catch (error) {
    console.error('PhonePe checkout initialization error:', error);
    return NextResponse.json({ error: 'Unable to initialize secure checkout.' }, { status: 500 });
  }
}