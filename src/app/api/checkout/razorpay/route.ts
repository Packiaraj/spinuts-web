import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { amount, customer } = await req.json();

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
  }

  const amountPaise = Math.round(amount * 100); // convert ₹ to paise
  const receiptId = `rcpt_${Date.now()}`;

  const orderPayload = {
    amount: amountPaise,
    currency: 'INR',
    receipt: receiptId,
    notes: {
      customer_name: customer?.name || '',
      customer_email: customer?.email || '',
    },
  };

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Razorpay error:', err);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }

  const order = await response.json();
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
}

// Verify payment signature (called after successful payment)
export async function PUT(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;
  return NextResponse.json({ verified: isValid });
}
