import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

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
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const currentOrder = orderSnap.data();
          // Ensure we do not overwrite if already confirmed
          if (currentOrder.payment?.status !== 'Paid') {
            await updateDoc(orderRef, {
              'payment.status': 'Paid',
              'payment.razorpayPaymentId': paymentId || 'VERIFIED_WEBHOOK',
              'payment.amount': amountPaid || currentOrder.payment?.amount,
              'payment.paidAt': new Date().toISOString(),
              status: 'Under verification', // Move forward to verification
              updatedAt: new Date().toISOString(),
            });

            // Create admin audit log
            const logId = `LOG_${Date.now()}`;
            await setDoc(doc(db, 'adminLogs', logId), {
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
