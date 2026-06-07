'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { SAMPLE_PRODUCTS } from '@/lib/sampleData';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { currency, addToCart } = useStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) { setProduct(data); return; }
      } catch { /* fall through */ }
      const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
      setProduct(found || null);
    }
    fetchProduct();
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const price = currency === 'INR' ? product.price_inr : product.price_usd;
  const originalPrice = currency === 'INR' ? product.original_price_inr : product.original_price_usd;
  const symbol = currency === 'INR' ? '₹' : '$';
  const discount = originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  function handleAddToCart() {
    addToCart(product!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square flex items-center justify-center"
          style={{ backgroundColor: '#f5f0eb', border: '0.5px solid rgba(0,0,0,0.08)' }}>
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <p className="text-8xl mb-4">🌿</p>
              <p className="label-tag" style={{ color: '#1B4332' }}>{product.category}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="py-4">
          <p className="label-tag mb-2" style={{ color: '#1B4332' }}>{product.category}</p>
          <h1 className="text-3xl font-medium mb-2" style={{ fontWeight: 500 }}>{product.name}</h1>

          <div className="flex items-center gap-3 mb-1">
            <span className="label-tag px-2 py-1" style={{ color: '#1B4332', border: '0.5px solid rgba(27,67,50,0.3)' }}>
              {product.origin}
            </span>
            <span className="label-tag text-gray-400">{product.weight}</span>
          </div>

          <div className="flex items-baseline gap-3 my-6">
            <span className="text-2xl font-medium" style={{ color: '#1B4332', fontWeight: 500 }}>
              {symbol}{price}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-gray-400 line-through">{symbol}{originalPrice}</span>
                <span className="label-tag px-2 py-1" style={{ backgroundColor: '#D4A017', color: '#1B4332' }}>
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center" style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}>
              <button className="px-3 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus size={14} />
              </button>
              <span className="px-4 py-3 text-sm font-medium">{qty}</span>
              <button className="px-3 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setQty(qty + 1)}>
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-all"
              style={{ backgroundColor: added ? '#D4A017' : '#1B4332', color: '#FFF8F0', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              <ShoppingBag size={16} />
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          {product.stock <= 10 && product.stock > 0 && (
            <p className="label-tag text-orange-600">Only {product.stock} left in stock</p>
          )}
          {product.stock === 0 && (
            <p className="label-tag text-red-600">Out of stock</p>
          )}
        </div>
      </div>

      {/* Origin story */}
      <div className="mt-20 py-12" style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div className="max-w-2xl">
          <p className="label-tag mb-4" style={{ color: '#D4A017' }}>Origin Story</p>
          <h2 className="text-2xl font-medium mb-4" style={{ fontWeight: 500 }}>Sourced from {product.origin}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every product at SpiNuts is traced back to its source. Our team works directly with farming families
            to ensure fair pricing, ethical practices, and the freshest possible produce reaching your kitchen.
            This {product.name} comes from {product.origin} — one of the most respected growing regions for {product.category} in India.
          </p>
        </div>
      </div>
    </div>
  );
}
