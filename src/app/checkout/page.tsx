'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

type PaymentMethod = 'razorpay' | 'stripe' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currency, cartTotal, clearCart } = useStore();
  const symbol = currency === 'INR' ? '₹' : '$';
  const total = cartTotal();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '', country: currency === 'INR' ? 'India' : 'USA',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(currency === 'INR' ? 'razorpay' : 'stripe');
  const [loading, setLoading] = useState(false);

  function update(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'cod') {
      // Simulate order placement
      setTimeout(() => {
        clearCart();
        router.push('/checkout/success');
      }, 1000);
      return;
    }

    if (paymentMethod === 'razorpay') {
      try {
        const res = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, currency: 'INR', customer: form }),
        });
        const data = await res.json();
        if (data.orderId) {
          const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
          const rzp = new Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100,
            currency: 'INR',
            order_id: data.orderId,
            name: 'SpiNuts',
            description: 'Premium Kerala Spices & Nuts',
            prefill: { name: form.name, email: form.email, contact: form.phone },
            handler: () => { clearCart(); router.push('/checkout/success'); },
          });
          rzp.open();
        }
      } catch (err) {
        console.error(err);
        alert('Payment failed. Please try again.');
      }
      setLoading(false);
    }

    if (paymentMethod === 'stripe') {
      try {
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, currency: 'USD', customer: form, items: cart }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error(err);
        alert('Payment failed. Please try again.');
      }
      setLoading(false);
    }
  }

  const inputClass = "w-full text-sm py-2.5 px-3 bg-white transition-colors";
  const inputStyle = { border: '0.5px solid rgba(0,0,0,0.15)' };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium mb-10" style={{ fontWeight: 500 }}>Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
        {/* Left: form */}
        <div className="md:col-span-2 space-y-8">
          {/* Customer */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Customer Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Full Name</label>
                <input required className={inputClass} style={inputStyle} value={form.name}
                  onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">Email</label>
                <input required type="email" className={inputClass} style={inputStyle} value={form.email}
                  onChange={(e) => update('email', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">Phone</label>
                <input required className={inputClass} style={inputStyle} value={form.phone}
                  onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Delivery Address</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Address Line 1</label>
                <input required className={inputClass} style={inputStyle} value={form.line1}
                  onChange={(e) => update('line1', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label-tag text-gray-500 block mb-1">Address Line 2</label>
                <input className={inputClass} style={inputStyle} value={form.line2}
                  onChange={(e) => update('line2', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">City</label>
                <input required className={inputClass} style={inputStyle} value={form.city}
                  onChange={(e) => update('city', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">State</label>
                <input required className={inputClass} style={inputStyle} value={form.state}
                  onChange={(e) => update('state', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">PIN / ZIP Code</label>
                <input required className={inputClass} style={inputStyle} value={form.pincode}
                  onChange={(e) => update('pincode', e.target.value)} />
              </div>
              <div>
                <label className="label-tag text-gray-500 block mb-1">Country</label>
                <select required className={inputClass} style={inputStyle} value={form.country}
                  onChange={(e) => update('country', e.target.value)}>
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Payment Method</p>
            <div className="space-y-2">
              {currency === 'INR' && (
                <>
                  <label className="flex items-center gap-3 p-4 cursor-pointer"
                    style={{ border: `0.5px solid ${paymentMethod === 'razorpay' ? '#1B4332' : 'rgba(0,0,0,0.12)'}` }}>
                    <input type="radio" name="payment" value="razorpay"
                      checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                    <div>
                      <p className="text-sm font-medium">Razorpay</p>
                      <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 cursor-pointer"
                    style={{ border: `0.5px solid ${paymentMethod === 'cod' ? '#1B4332' : 'rgba(0,0,0,0.12)'}` }}>
                    <input type="radio" name="payment" value="cod"
                      checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives</p>
                    </div>
                  </label>
                </>
              )}
              {currency === 'USD' && (
                <label className="flex items-center gap-3 p-4 cursor-pointer"
                  style={{ border: `0.5px solid ${paymentMethod === 'stripe' ? '#1B4332' : 'rgba(0,0,0,0.12)'}` }}>
                  <input type="radio" name="payment" value="stripe"
                    checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                  <div>
                    <p className="text-sm font-medium">Stripe</p>
                    <p className="text-xs text-gray-500">Credit / Debit Card, Apple Pay, Google Pay</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="md:col-span-1">
          <div className="p-6 bg-white sticky top-24" style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Order Summary</p>
            {cart.map((item) => {
              const price = currency === 'INR' ? item.product.price_inr : item.product.price_usd;
              return (
                <div key={item.product.id} className="flex justify-between text-xs mb-2 text-gray-600">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{symbol}{(price * item.quantity).toFixed(0)}</span>
                </div>
              );
            })}
            <div className="flex justify-between font-medium mt-4 pt-4 text-sm"
              style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
              <span>Total</span>
              <span style={{ color: '#1B4332' }}>{symbol}{total.toFixed(0)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="block w-full text-center py-3 mt-6 label-tag transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
