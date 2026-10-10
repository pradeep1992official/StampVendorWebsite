import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { fetchPhonePeOrderStatus, getPhonePeAccessToken, getPhonePeCredentials } from '@/lib/phonepe';

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!idToken) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 });

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
    if (order.payment?.status === 'Paid') return NextResponse.json({ paid: true });

    const credentials = getPhonePeCredentials();
    const merchantOrderId = order.payment?.phonepeMerchantOrderId;
    if (!credentials || !merchantOrderId) {
      return NextResponse.json({ error: 'No PhonePe payment attempt was found for this order.' }, { status: 404 });
    }

    const accessToken = await getPhonePeAccessToken(credentials);
    const paymentStatus = await fetchPhonePeOrderStatus(credentials, accessToken, merchantOrderId);
    const completedPayment = paymentStatus.paymentDetails?.find((payment) => payment.state === 'COMPLETED');
    if (paymentStatus.state === 'COMPLETED') {
      if (paymentStatus.amount !== Math.round(Number(order.payment.amount) * 100)) {
        console.error('PhonePe amount mismatch for order:', orderId);
        return NextResponse.json({ error: 'Payment amount did not match the order.' }, { status: 409 });
      }

      await orderRef.update({
        'payment.status': 'Paid',
        'payment.phonepeTransactionId': completedPayment?.transactionId ?? merchantOrderId,
        'payment.paidAt': new Date().toISOString(),
        status: 'Under verification',
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({
      paid: false,
      state: paymentStatus.state ?? 'PENDING',
      expireAt: paymentStatus.expireAt,
      initiatedAt: order.payment?.phonepeInitiatedAt,
    });
  } catch (error) {
    console.error('PhonePe status verification error:', error);
    return NextResponse.json({ error: 'Unable to verify PhonePe payment right now.' }, { status: 500 });
  }
}