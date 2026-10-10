import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
function isAuthorizedWebhook(req: NextRequest) {
  const username = process.env.PHONEPE_WEBHOOK_USERNAME;
  const password = process.env.PHONEPE_WEBHOOK_PASSWORD;
  const authorization = req.headers.get('authorization') ?? '';
  if (!username || !password) return false;

  const provided = Buffer.from(authorization.toLowerCase(), 'utf8');
  const expected = Buffer.from(
    crypto.createHash('sha256').update(`${username}:${password}`).digest('hex'),
    'utf8',
  );
  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedWebhook(req)) {
      return NextResponse.json({ error: 'Invalid webhook credentials.' }, { status: 401 });
    }

    const eventBody = await req.json();
    if (eventBody.event !== 'checkout.order.completed' && eventBody.event !== 'checkout.order.failed') {
      return NextResponse.json({ status: 'ignored' });
    }
    const payload = eventBody.payload;
    const isCompleted = payload?.state === 'COMPLETED';
    const isFailed = payload?.state === 'FAILED';
    if (!isCompleted && !isFailed) return NextResponse.json({ status: 'ignored' });

    const merchantOrderId = typeof payload.merchantOrderId === 'string'
      ? payload.merchantOrderId
      : '';
    if (!merchantOrderId) return NextResponse.json({ error: 'Missing merchant order reference.' }, { status: 400 });

    const db = getAdminDb();
    const matches = await db.collection('orders')
      .where('payment.phonepeMerchantOrderIds', 'array-contains', merchantOrderId)
      .limit(1)
      .get();
    if (matches.empty) return NextResponse.json({ error: 'Payment order not found.' }, { status: 404 });

    const orderDoc = matches.docs[0];
    const order = orderDoc.data();
    if (payload.amount !== Math.round(Number(order.payment?.amount) * 100)) {
      console.error('PhonePe webhook amount mismatch for order:', order.orderId);
      return NextResponse.json({ error: 'PhonePe payment amount mismatch.' }, { status: 409 });
    }

    const completedPayment = Array.isArray(payload.paymentDetails)
      ? payload.paymentDetails.find((payment: { state?: string }) => payment.state === 'COMPLETED')
      : undefined;
    await db.runTransaction(async (transaction) => {
      const currentSnap = await transaction.get(orderDoc.ref);
      const currentOrder = currentSnap.data();
      if (!currentSnap.exists || currentOrder?.payment?.status === 'Paid') return;

      const now = new Date().toISOString();
      if (isFailed) {
        if (currentOrder?.payment?.phonepeMerchantOrderId === merchantOrderId) {
          transaction.update(orderDoc.ref, {
            'payment.status': 'Failed',
            updatedAt: now,
          });
        }
        return;
      }

      transaction.update(orderDoc.ref, {
        'payment.status': 'Paid',
        'payment.phonepeTransactionId': completedPayment?.transactionId ?? merchantOrderId,
        'payment.paidAt': now,
        status: 'Under verification',
        updatedAt: now,
      });
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('PhonePe webhook processing error:', error);
    return NextResponse.json({ error: 'PhonePe webhook handling failed.' }, { status: 500 });
  }
}