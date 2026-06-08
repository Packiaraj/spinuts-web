'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';

const CATEGORY_EMOJI: Record<string, string> = {
  spices: '🌶️', nuts: '🥜', seeds: '🌱', millets: '🌾', 'dry-fruits': '🍇',
};

export default function ProductCard({ product }: { product: Product }) {
  const { currency, addToCart } = useStore();
  const price = currency === 'INR' ? product.price_inr : product.price_usd;
  const originalPrice = currency === 'INR' ? product.original_price_inr : product.original_price_usd;
  const symbol = currency === 'INR' ? '₹' : '$';
  const [imgError, setImgError] = useState(false);
  const [addState, setAddState] = useState<'idle' | 'adding' | 'added'>('idle');
  const hasImage = product.images?.[0] && !imgError;
  const [english, tamil] = product.name.split(' / ');
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  function handleAdd() {
    if (addState !== 'idle') return;
    setAddState('adding');
    addToCart(product);
    setTimeout(() => setAddState('added'), 600);
    setTimeout(() => setAddState('idle'), 1800);
  }

  return (
    <div className="product-card" style={{ border: '1px solid #E8D9C8' }}>
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="card-img relative aspect-square" style={{ backgroundColor: '#F5EBD8' }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span style={{ fontSize: '3.5rem' }}>{CATEGORY_EMOJI[product.category] || '🌿'}</span>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {hasDiscount && (
              <span className="tag px-2 py-1"
                style={{ backgroundColor: '#C4783A', color: '#fff', fontSize: '0.55rem', borderRadius: 2 }}>
                {discountPct}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="tag mb-1.5" style={{ color: '#C4783A', fontSize: '0.55rem' }}>{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1A0E05', lineHeight: 1.35, marginBottom: 2 }}>
            {english}
            {tamil && <span style={{ color: '#8B6F5E', fontWeight: 400, fontSize: '0.82rem' }}> / {tamil}</span>}
          </h3>
        </Link>
        <p style={{ fontSize: '0.75rem', color: '#8B6F5E', marginBottom: 14 }}>{product.weight}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span style={{ fontWeight: 600, color: '#2C1A0E', fontSize: '0.95rem' }}>{symbol}{price}</span>
            {hasDiscount && (
              <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#B8A098' }}>
                {symbol}{originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="tag transition-all duration-200"
            style={{
              padding: '8px 14px',
              fontSize: '0.58rem',
              borderRadius: 2,
              minWidth: 68,
              border: addState === 'added' ? '1.5px solid #C4783A' : '1.5px solid #2C1A0E',
              backgroundColor: addState === 'added' ? '#C4783A' : addState === 'adding' ? '#2C1A0E' : 'transparent',
              color: addState === 'idle' ? '#2C1A0E' : '#FDF6EE',
              transform: addState === 'adding' ? 'scale(0.95)' : 'scale(1)',
            }}
          >
            {addState === 'added' ? '✓ Added' : addState === 'adding' ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
