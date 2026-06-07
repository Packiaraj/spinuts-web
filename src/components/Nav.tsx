'use client';
import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Nav() {
  const cartCount = useStore((s) => s.cartCount());

  return (
    <nav className="bg-white sticky top-0 z-50" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.12)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-500" style={{ color: '#1B4332', fontWeight: 500, letterSpacing: '0.05em' }}>
            SPINUTS
          </span>
          <span className="label-tag" style={{ color: '#D4A017' }}>by Amigoz</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {['Shop', 'Our Story', 'Origin'].map((label) => (
            <Link
              key={label}
              href={label === 'Shop' ? '/products' : label === 'Our Story' ? '/story' : '/origin'}
              className="label-tag text-gray-600 hover:text-[#1B4332] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <button className="text-gray-600 hover:text-[#1B4332] transition-colors">
            <Search size={18} />
          </button>
          <Link href="/cart" className="relative text-gray-600 hover:text-[#1B4332] transition-colors">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px]"
                style={{ backgroundColor: '#1B4332' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
