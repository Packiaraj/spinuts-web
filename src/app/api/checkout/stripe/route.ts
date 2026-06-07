import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const { items, customer } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const lineItems = items.map((item: { product: { name: string; weight: string; origin: string; price_usd: number }; quantity: number }) =>
      `line_items[][price_data][currency]=usd` +
      `&line_items[][price_data][product_data][name]=${encodeURIComponent(item.product.name)}` +
      `&line_items[][price_data][unit_amount]=${Math.round(item.product.price_usd * 100)}` +
      `&line_items[][quantity]=${item.quantity}`
    ).join('&');

    const body = [
      'mode=payment',
      `customer_email=${encodeURIComponent(customer.email)}`,
      `success_url=${encodeURIComponent(`${appUrl}/checkout/success`)}`,
      `cancel_url=${encodeURIComponent(`${appUrl}/cart`)}`,
      lineItems,
    ].join('&');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const session = await response.json();
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
