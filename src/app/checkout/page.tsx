'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { SpiceLoader } from '@/components/SpiceLoader';
type PaymentMethod = 'razorpay' | 'gpay' | 'phonepe' | 'cod';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const total = cartTotal();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingConfig, setShippingConfig] = useState({ tn_cost: 60, tn_free_above: 799, other_cost: 120 });

  useEffect(() => {
    loadRazorpayScript();
    async function fetchShipping() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('site_content')
          .select('key, value')
          .in('key', ['shipping_tn_cost', 'shipping_tn_free_above', 'shipping_other_cost']);
        if (data) {
          const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, Number(r.value)]));
          setShippingConfig({
            tn_cost: map.shipping_tn_cost ?? 60,
            tn_free_above: map.shipping_tn_free_above ?? 799,
            other_cost: map.shipping_other_cost ?? 120,
          });
        }
      } catch { /* use defaults */ }
    }
    fetchShipping();
  }, []);

  function update(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleRazorpay(upiApp?: 'gpay' | 'phonepe') {
    const loaded = await loadRazorpayScript();
    if (!loaded) { setError('Failed to load Razorpay. Please check your connection.'); return; }

    const res = await fetch('/api/checkout/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: grandTotal, customer: form }),
    });
    const data = await res.json();

    if (!data.orderId) {
      setError(data.error || 'Could not create order. Please try again.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Razorpay = (window as any).Razorpay;
    const rzp = new Razorpay({
      ...(upiApp && {
        config: {
          display: {
            blocks: {
              utib: { name: upiApp === 'gpay' ? 'Pay via GPay' : 'Pay via PhonePe', instruments: [{ method: 'upi', apps: [upiApp === 'gpay' ? 'google_pay' : 'phonepe'] }] },
            },
            sequence: ['block.utib'],
            preferences: { show_default_blocks: false },
          },
        },
      }),
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: 'INR',
      order_id: data.orderId,
      name: 'SpiNuts',
      description: 'Premium Spices & Nuts from the Western Ghats',
      image: 'https://spinuts.store/favicon.ico',
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        address: `${form.line1}, ${form.city}, ${form.state} - ${form.pincode}`,
      },
      theme: { color: '#1B4332' },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        // Verify signature server-side
        const verifyRes = await fetch('/api/checkout/razorpay', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        const { verified } = await verifyRes.json();
        if (verified) {
          // Save order to Supabase
          try {
            const { supabase } = await import('@/lib/supabase');
            await supabase.from('orders').insert([{
              customer_name: form.name,
              customer_email: form.email,
              customer_phone: form.phone,
              address: `${form.line1}${form.line2 ? ', ' + form.line2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
              items: cart,
              total: grandTotal,
              shipping_charge: shippingCharge,
              payment_method: 'razorpay',
              payment_id: response.razorpay_payment_id,
              status: 'confirmed',
            }]);
          } catch { /* log but don't block */ }
          clearCart();
          router.push('/checkout/success');
        } else {
          setError('Payment verification failed. Please contact support.');
        }
        setLoading(false);
      },
      modal: {
        ondismiss: () => { setLoading(false); },
      },
    });

    rzp.open();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (paymentMethod === 'cod') {
      try {
        const { supabase } = await import('@/lib/supabase');
        await supabase.from('orders').insert([{
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          address: `${form.line1}${form.line2 ? ', ' + form.line2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
          items: cart,
          total: grandTotal,
          shipping_charge: shippingCharge,
          payment_method: 'cod',
          status: 'pending',
        }]);
      } catch { /* ignore */ }
      clearCart();
      router.push('/checkout/success');
      return;
    }

    if (paymentMethod === 'razorpay') await handleRazorpay();
    if (paymentMethod === 'gpay') await handleRazorpay('gpay');
    if (paymentMethod === 'phonepe') await handleRazorpay('phonepe');
  }

  // Shipping calculation
  const isTamilNadu = form.state.trim().toLowerCase().replace(/\s+/g, '') === 'tamilnadu' ||
    form.state.trim().toLowerCase() === 'tn';
  const shippingCharge = isTamilNadu
    ? (total >= shippingConfig.tn_free_above ? 0 : shippingConfig.tn_cost)
    : (form.state ? shippingConfig.other_cost : 0);
  const grandTotal = total + shippingCharge;

  const inp = "w-full text-sm py-2.5 px-3 bg-white";
  const inpS = { border: '0.5px solid rgba(0,0,0,0.15)' };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🛒</p>
        <p className="text-lg font-medium">Your cart is empty</p>
        <a href="/products" className="label-tag px-6 py-3" style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
          Shop Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium mb-10" style={{ fontWeight: 500 }}>Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
        {/* Left */}
        <div className="md:col-span-2 space-y-8">

          {/* Customer */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Customer Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Full Name *</label>
                <input required className={inp} style={inpS} value={form.name}
                  onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">Email *</label>
                <input required type="email" className={inp} style={inpS} value={form.email}
                  onChange={(e) => update('email', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">Phone *</label>
                <input required type="tel" className={inp} style={inpS} value={form.phone}
                  placeholder="+91 9876543210"
                  onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Delivery Address</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Address Line 1 *</label>
                <input required className={inp} style={inpS} value={form.line1}
                  onChange={(e) => update('line1', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Address Line 2</label>
                <input className={inp} style={inpS} value={form.line2}
                  onChange={(e) => update('line2', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">City *</label>
                <input required className={inp} style={inpS} value={form.city}
                  onChange={(e) => update('city', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">State *</label>
                <input required className={inp} style={inpS} value={form.state}
                  onChange={(e) => update('state', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">PIN Code *</label>
                <input required className={inp} style={inpS} value={form.pincode}
                  maxLength={6} onChange={(e) => update('pincode', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Payment Method</p>

            {/* UPI Apps */}
            <p className="label-tag text-gray-400 mb-3">Pay via UPI App</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* GPay */}
              <label className="flex flex-col items-center gap-2 p-3 cursor-pointer transition-all rounded-sm"
                style={{ border: `1.5px solid ${paymentMethod === 'gpay' ? '#1a73e8' : 'rgba(0,0,0,0.1)'}`, backgroundColor: paymentMethod === 'gpay' ? '#e8f0fe' : 'white' }}>
                <input type="radio" name="payment" value="gpay" className="hidden"
                  checked={paymentMethod === 'gpay'} onChange={() => setPaymentMethod('gpay')} />
                <svg viewBox="0 0 48 48" width="36" height="36">
                  <path fill="#4285F4" d="M23.9 20.3v3.9h5.8c-.2 1.5-1.7 4.4-5.8 4.4-3.5 0-6.3-2.9-6.3-6.5s2.8-6.5 6.3-6.5c2 0 3.3.8 4 1.6l2.7-2.6C28.8 13.1 26.6 12 23.9 12c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7h-9.4z"/>
                  <path fill="#34A853" d="M23.9 32c2.8 0 5.1-.9 6.8-2.5l-3.2-2.5c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-5.9-4.4h-3.3v2.6C19 29.9 21.3 32 23.9 32z"/>
                  <path fill="#FBBC05" d="M18 23.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2v-2.6h-3.3c-.7 1.4-1.1 2.9-1.1 4.6s.4 3.2 1.1 4.6L18 23.6z"/>
                  <path fill="#EA4335" d="M23.9 15.6c1.6 0 2.6.7 3.2 1.3l2.4-2.3C27.9 13.2 26.1 12 23.9 12c-2.6 0-4.9 1.1-6.5 2.9l3.3 2.6c.8-1.8 2.4-2.9 3.2-1.9z"/>
                </svg>
                <span className="text-xs font-medium text-gray-700">GPay</span>
              </label>

              {/* PhonePe */}
              <label className="flex flex-col items-center gap-2 p-3 cursor-pointer transition-all rounded-sm"
                style={{ border: `1.5px solid ${paymentMethod === 'phonepe' ? '#5f259f' : 'rgba(0,0,0,0.1)'}`, backgroundColor: paymentMethod === 'phonepe' ? '#f3e8ff' : 'white' }}>
                <input type="radio" name="payment" value="phonepe" className="hidden"
                  checked={paymentMethod === 'phonepe'} onChange={() => setPaymentMethod('phonepe')} />
                <svg viewBox="0 0 48 48" width="36" height="36">
                  <rect width="48" height="48" rx="10" fill="#5f259f"/>
                  <path fill="white" d="M24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8zm6.5 17.5c0 3.6-2.9 6.5-6.5 6.5h-4v3l-4-4 4-4v3h4c1.4 0 2.5-1.1 2.5-2.5v-8.5H30v6.5z"/>
                </svg>
                <span className="text-xs font-medium text-gray-700">PhonePe</span>
              </label>

              {/* QR Code — just triggers razorpay */}
              <label className="flex flex-col items-center gap-2 p-3 cursor-pointer transition-all rounded-sm"
                style={{ border: `1.5px solid ${paymentMethod === 'razorpay' ? '#1B4332' : 'rgba(0,0,0,0.1)'}`, backgroundColor: paymentMethod === 'razorpay' ? 'rgba(27,67,50,0.05)' : 'white' }}>
                <input type="radio" name="payment" value="razorpay" className="hidden"
                  checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <div className="text-2xl">⬛</div>
                <span className="text-xs font-medium text-gray-700">More Options</span>
              </label>
            </div>

            {/* Info pill when GPay/PhonePe selected */}
            {(paymentMethod === 'gpay' || paymentMethod === 'phonepe') && (
              <div className="mb-4 px-4 py-3 flex items-center gap-3 text-xs text-gray-500"
                style={{ border: '0.5px solid rgba(0,0,0,0.08)', backgroundColor: '#f9f9f9' }}>
                <span className="text-base">{paymentMethod === 'gpay' ? '🟢' : '🟣'}</span>
                <span>
                  Click <strong>Pay ₹{grandTotal.toFixed(0)}</strong> — Razorpay will open{' '}
                  {paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'} directly for instant UPI payment.
                  Your order is confirmed automatically once payment succeeds.
                </span>
              </div>
            )}

            <div className="space-y-3">
              <label className="flex items-start gap-4 p-4 cursor-pointer transition-colors"
                style={{ border: `0.5px solid ${paymentMethod === 'razorpay' ? '#1B4332' : 'rgba(0,0,0,0.12)'}`,
                  backgroundColor: paymentMethod === 'razorpay' ? 'rgba(27,67,50,0.03)' : 'white' }}>
                <input type="radio" name="payment" value="razorpay" className="mt-0.5"
                  checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">All Payment Options</p>
                    <span className="label-tag px-2 py-0.5 text-white" style={{ backgroundColor: '#1B4332', fontSize: '0.6rem' }}>Recommended</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">UPI · Cards · Net Banking · Paytm · Wallets</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['VISA', 'MC', 'UPI', 'NB', 'Paytm'].map((m) => (
                      <span key={m} className="text-xs px-1.5 py-0.5 text-gray-400"
                        style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>{m}</span>
                    ))}
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 cursor-pointer transition-colors"
                style={{ border: `0.5px solid ${paymentMethod === 'cod' ? '#1B4332' : 'rgba(0,0,0,0.12)'}`,
                  backgroundColor: paymentMethod === 'cod' ? 'rgba(27,67,50,0.03)' : 'white' }}>
                <input type="radio" name="payment" value="cod" className="mt-0.5"
                  checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div>
                  <p className="text-sm font-medium mb-1">🚚 Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay in cash when your order arrives</p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600" style={{ border: '0.5px solid #fcc', backgroundColor: '#fff8f8' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div>
          <div className="p-6 bg-white sticky top-24" style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Order Summary</p>

            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs text-gray-600">
                  <span className="flex-1 pr-2">{item.product.name.split(' / ')[0]} × {item.quantity}</span>
                  <span className="shrink-0">₹{(item.product.price_inr * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3" style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shipping</span>
                {!form.state ? (
                  <span className="text-gray-400">Enter state</span>
                ) : shippingCharge === 0 ? (
                  <span className="font-medium" style={{ color: '#059669' }}>🎉 Free</span>
                ) : (
                  <span className="text-gray-700">₹{shippingCharge}</span>
                )}
              </div>
              {isTamilNadu && total < shippingConfig.tn_free_above && form.state && (
                <p className="text-xs p-2 rounded" style={{ backgroundColor: 'rgba(27,67,50,0.06)', color: '#1B4332' }}>
                  Add ₹{(shippingConfig.tn_free_above - total).toFixed(0)} more for free shipping!
                </p>
              )}
              {isTamilNadu && shippingCharge === 0 && (
                <p className="text-xs p-2 rounded" style={{ backgroundColor: 'rgba(5,150,105,0.08)', color: '#059669' }}>
                  ✓ Free shipping applied within Tamil Nadu
                </p>
              )}
            </div>

            <div className="flex justify-between font-medium mt-3 pt-3 text-sm"
              style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
              <span>Total</span>
              <span style={{ color: '#1B4332' }}>₹{grandTotal.toFixed(0)}</span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 mt-5 label-tag transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
              {loading
                ? <><SpiceLoader size="sm" /> Processing...</>
                : paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${grandTotal.toFixed(0)}`}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">🔒 Secured by Razorpay</p>
          </div>
        </div>
      </form>
    </div>
  );
}
