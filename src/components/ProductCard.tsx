'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { currency, addToCart } = useStore();
  const price = currency === 'INR' ? product.price_inr : product.price_usd;
  const originalPrice = currency === 'INR' ? product.original_price_inr : product.original_price_usd;
  const symbol = currency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-white group" style={{ border: '0.5px solid rgba(0,0,0,0.10)' }}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f5f0eb' }}>
              <span className="text-4xl">🌿</span>
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
          <h3 className="font-medium text-sm mb-1 hover:text-[#1B4332] transition-colors">{product.name}</h3>
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
