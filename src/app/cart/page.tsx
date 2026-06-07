'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const { cart, currency, updateQty, removeFromCart, cartTotal } = useStore();
  const symbol = currency === 'INR' ? '₹' : '$';
  const total = cartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <p className="text-5xl">🛍️</p>
        <h1 className="text-2xl font-medium" style={{ fontWeight: 500 }}>Your cart is empty</h1>
        <p className="text-gray-500 text-sm">Add some products to get started.</p>
        <Link href="/products" className="label-tag px-6 py-3"
          style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium mb-10" style={{ fontWeight: 500 }}>Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Items */}
        <div className="md:col-span-2 space-y-0">
          <div className="grid grid-cols-12 gap-4 pb-3 mb-2 label-tag text-gray-400"
            style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Qty</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          {cart.map((item) => {
            const price = currency === 'INR' ? item.product.price_inr : item.product.price_usd;
            return (
              <div key={item.product.id} className="grid grid-cols-12 gap-4 py-5 items-center"
                style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                <div className="col-span-6">
                  <p className="label-tag mb-1" style={{ color: '#1B4332' }}>{item.product.origin}</p>
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.product.weight} · {symbol}{price} each</p>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <div className="flex items-center" style={{ border: '0.5px solid rgba(0,0,0,0.12)' }}>
                    <button className="px-2 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button className="px-2 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="col-span-3 text-right flex items-center justify-end gap-3">
                  <span className="font-medium text-sm">{symbol}{(price * item.quantity).toFixed(0)}</span>
                  <button onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="p-6 bg-white sticky top-24" style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Order Summary</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{symbol}{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-medium mt-4 pt-4"
              style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
              <span>Total</span>
              <span style={{ color: '#1B4332' }}>{symbol}{total.toFixed(0)}</span>
            </div>
            <Link href="/checkout"
              className="block w-full text-center py-3 mt-6 label-tag transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
              Proceed to Checkout
            </Link>
            <Link href="/products"
              className="block w-full text-center py-3 mt-2 label-tag text-gray-500 hover:text-[#1B4332]">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
