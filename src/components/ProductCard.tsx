'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { AddingToCart } from './SpiceLoader';

const CATEGORY_EMOJI: Record<string, string> = {
  spices: '🌶️', nuts: '🥜', seeds: '🌱', millets: '🌾', 'dry-fruits': '🍇',
};

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { currency, addToCart } = useStore();
  const price = currency === 'INR' ? product.price_inr : product.price_usd;
  const originalPrice = currency === 'INR' ? product.original_price_inr : product.original_price_usd;
  const symbol = currency === 'INR' ? '₹' : '$';
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const hasImage = product.images?.[0] && !imgError;
  const [english, tamil] = product.name.split(' / ');

  return (
    <div className="product-card bg-white group" style={{ border: '1px solid #E8E5DF' }}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#F4F1EB' }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">{CATEGORY_EMOJI[product.category] || '🌿'}</span>
            </div>
          )}
          {originalPrice && originalPrice > price && (
            <div className="absolute top-3 left-3">
              <span className="label-tag px-2 py-1 text-white" style={{ backgroundColor: '#B8860B', fontSize: '0.58rem' }}>
                Sale
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="label-tag mb-1.5" style={{ color: '#B8860B', fontSize: '0.58rem' }}>{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm mb-0.5 leading-snug" style={{ color: '#1A1A1A', fontWeight: 500 }}>
            {english}
            {tamil && <span style={{ color: '#999990', fontWeight: 400 }}> / {tamil}</span>}
          </h3>
        </Link>
        <p className="text-xs mb-4" style={{ color: '#999990' }}>{product.weight}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-medium" style={{ color: '#1A1A1A' }}>{symbol}{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs line-through" style={{ color: '#BBBBBB' }}>{symbol}{originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => { setAdding(true); addToCart(product); setTimeout(() => setAdding(false), 900); }}
            disabled={adding}
            className="label-tag px-3 py-2 transition-all"
            style={{
              border: '1px solid #1A1A1A',
              color: adding ? '#FAFAF8' : '#1A1A1A',
              backgroundColor: adding ? '#1A1A1A' : 'transparent',
              fontSize: '0.58rem',
              minWidth: 64,
            }}>
            {adding ? <AddingToCart /> : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
