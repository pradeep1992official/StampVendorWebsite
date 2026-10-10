import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminDb } from '@/lib/firebase-admin';
import { confirmPaidOrderAndGrantReferral } from '@/lib/referral-admin';

// In-memory idempotency cache for recently processed webhook events
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET is not configured on the server.');
      return NextResponse.json(
        { error: 'Webhook secret is not configured on the server.' },
        { status: 500 }
      );
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // Read raw body for cryptographically secure HMAC verification
    const rawBody = await req.text();
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const eventPayload = JSON.parse(rawBody);
    const eventId = eventPayload.event_id || eventPayload.payload?.payment?.entity?.id;

    // Idempotency check: prevent duplicate event processing
    if (eventId && processedEvents.has(eventId)) {
      return NextResponse.json({ status: 'duplicate_event_ignored' });
    }

    // Check payment captured or order paid events
    if (eventPayload.event === 'payment.captured' || eventPayload.event === 'order.paid') {
      const paymentEntity = eventPayload.payload?.payment?.entity;
      const orderNotes = paymentEntity?.notes || eventPayload.payload?.order?.entity?.notes;
      const orderId = orderNotes?.orderId;
      const paymentId = paymentEntity?.id;
      const amountPaid = paymentEntity?.amount ? paymentEntity.amount / 100 : 0;

      if (orderId) {
        const orderRef = getAdminDb().collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (orderSnap.exists) {
          const currentOrder = orderSnap.data();
          if (!currentOrder) {
            throw new Error(`Order ${orderId} exists but has no readable data.`);
          }
          if (currentOrder.payment?.status !== 'Paid') {
            if (Math.round(Number(currentOrder.payment?.amount) * 100) !== paymentEntity?.amount) {
              console.error('Razorpay webhook amount mismatch for order:', orderId);
              return NextResponse.json({ error: 'Payment amount did not match the order.' }, { status: 409 });
            }

            await confirmPaidOrderAndGrantReferral(orderId, {
              paymentUpdates: {
                'payment.gateway': 'Razorpay',
                'payment.razorpayPaymentId': paymentId || 'VERIFIED_WEBHOOK',
                'payment.amount': amountPaid,
              },
            });

            // Create admin audit log
            const logId = `LOG_${Date.now()}`;
            await getAdminDb().collection('adminLogs').doc(logId).set({
              logId,
              orderId,
              adminUid: 'SYSTEM_WEBHOOK',
              adminEmail: 'razorpay_webhook@system',
              action: 'PAYMENT_VERIFIED',
              previousStatus: currentOrder.status,
              newStatus: 'Under verification',
              notes: `Payment verified via Razorpay signature webhook. Payment ID: ${paymentId}`,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }

    if (eventId) {
      processedEvents.add(eventId);
      // Clean old entries after 500 records
      if (processedEvents.size > 500) {
        const first = processedEvents.values().next().value;
        if (first) processedEvents.delete(first);
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
