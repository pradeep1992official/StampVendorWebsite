import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Strict constraint: Never simulate fake successful payment when credentials are unavailable
    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          available: false,
          code: 'GATEWAY_CREDENTIALS_MISSING',
          error: 'Online payment gateway credentials (Razorpay Key ID & Secret) are not yet configured on this server. Online automated payment is currently unavailable.',
          instruction: 'Please contact the certified stamp vendor desk directly to finalize payment via UPI or counter invoice.',
        },
        { status: 503 }
      );
    }

    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { available: false, error: 'Invalid order reference or payable amount.' },
        { status: 400 }
      );
    }

    // Call Razorpay Orders API
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `rcpt_${orderId.substring(0, 30)}`,
        notes: {
          orderId,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errData = await razorpayResponse.json();
      console.error('Razorpay order creation failed:', errData);
      return NextResponse.json(
        { available: false, error: 'Payment gateway rejected order creation. Please try again later.' },
        { status: 502 }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    return NextResponse.json({
      available: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { available: false, error: 'Unable to initialize payment transaction.' },
      { status: 500 }
    );
  }
}
