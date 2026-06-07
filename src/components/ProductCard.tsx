'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';

const CATEGORY_EMOJI: Record<string, string> = {
  spices: '🌶️',
  nuts: '🥜',
  seeds: '🌱',
  millets: '🌾',
  'dry-fruits': '🍇',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { currency, addToCart } = useStore();
  const price = currency === 'INR' ? product.price_inr : product.price_usd;
  const originalPrice = currency === 'INR' ? product.original_price_inr : product.original_price_usd;
  const symbol = currency === 'INR' ? '₹' : '$';
  const [imgError, setImgError] = useState(false);

  const hasImage = product.images?.[0] && !imgError;

  return (
    <div className="bg-white group" style={{ border: '0.5px solid rgba(0,0,0,0.10)' }}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#f5f0eb' }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">{CATEGORY_EMOJI[product.category] || '🌿'}</span>
              <span className="label-tag text-gray-400">{product.category}</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="label-tag px-2 py-1 bg-white" style={{ color: '#1B4332', border: '0.5px solid rgba(27,67,50,0.2)' }}>
              {product.origin}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="label-tag mb-1" style={{ color: '#1B4332' }}>{product.category}</p>
        <Link href={`/products/${product.id}`}>
          {(() => {
            const [english, tamil] = product.name.split(' / ');
            return (
              <h3 className="font-medium text-sm mb-1 hover:text-[#1B4332] transition-colors leading-snug">
                {english}
                {tamil && <span className="font-normal text-gray-400 ml-1">/ {tamil}</span>}
              </h3>
            );
          })()}
        </Link>
        <p className="text-xs text-gray-500 mb-3">{product.weight}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-medium" style={{ color: '#1B4332' }}>{symbol}{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">{symbol}{originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="label-tag px-3 py-2 transition-colors hover:bg-[#1B4332] hover:text-white"
            style={{ border: '0.5px solid #1B4332', color: '#1B4332' }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
