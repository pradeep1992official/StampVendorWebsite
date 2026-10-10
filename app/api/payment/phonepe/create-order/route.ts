import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { calculateOrderPrice, DEFAULT_PRICING, PricingConfig } from '@/src/config/pricing';
import { getAdminDb, verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { getPhonePeAccessToken, getPhonePeApiBase, getPhonePeCredentials } from '@/lib/phonepe';

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!idToken) return NextResponse.json({ error: 'Sign in is required to pay.' }, { status: 401 });

    const decodedToken = await verifyFirebaseIdToken(idToken);
    const body = await req.json();
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : '';
    if (!orderId) return NextResponse.json({ error: 'A valid order reference is required.' }, { status: 400 });

    const credentials = getPhonePeCredentials();
    if (!credentials) {
      return NextResponse.json({
        available: false,
        error: 'PhonePe Business payment is not configured yet. Your order is saved; please contact the vendor desk or retry after setup.',
      }, { status: 503 });
    }

    const db = getAdminDb();
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

    const order = orderSnap.data()!;
    if (order.ownerUid !== decodedToken.uid) return NextResponse.json({ error: 'Order access denied.' }, { status: 403 });
    if (order.payment?.status === 'Paid') return NextResponse.json({ error: 'This order is already paid.' }, { status: 409 });

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
    const amount = Math.round(price.totalPayable * 100);
    const merchantOrderId = `TN${Date.now()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const initiatedAt = Date.now();
    const redirectUrl = new URL('/payment/phonepe/return', req.nextUrl.origin);
    redirectUrl.searchParams.set('orderId', orderId);
    redirectUrl.searchParams.set('paymentStartedAt', String(initiatedAt));

    const accessToken = await getPhonePeAccessToken(credentials);
    const paymentResponse = await fetch(`${getPhonePeApiBase(credentials.production)}/checkout/v2/pay`, {
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

    const paymentData = await paymentResponse.json();
    const checkoutUrl = paymentData.redirectUrl ?? paymentData.redirect_url;
    if (!paymentResponse.ok || !checkoutUrl) {
      console.error('PhonePe checkout creation failed:', paymentData.code ?? paymentResponse.status);
      return NextResponse.json({ error: 'PhonePe could not start checkout. Please retry.' }, { status: 502 });
    }

    await orderRef.update({
      'payment.gateway': 'PhonePe',
      'payment.status': 'Pending',
      'payment.amount': price.totalPayable,
      'payment.phonepeMerchantOrderId': merchantOrderId,
      'payment.phonepeMerchantOrderIds': FieldValue.arrayUnion(merchantOrderId),
      'payment.phonepeRedirectUrl': checkoutUrl,
      'payment.phonepeInitiatedAt': initiatedAt,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      available: true,
      redirectUrl: checkoutUrl,
      merchantOrderId,
      initiatedAt,
    });
  } catch (error) {
    console.error('PhonePe checkout initialization error:', error);
    return NextResponse.json({ error: 'Unable to initialize PhonePe checkout.' }, { status: 500 });
  }
}