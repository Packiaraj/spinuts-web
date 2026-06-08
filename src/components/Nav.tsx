'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Nav() {
  const cartCount = useStore((s) => s.cartCount());

  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: '#FAFAF8', borderBottom: '1px solid #E8E5DF' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#1A1A1A', letterSpacing: '0.04em' }}>
            SpiNuts
          </span>
          <span className="label-tag" style={{ color: '#B8860B', letterSpacing: '0.18em', marginTop: 1 }}>Western Ghats</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-10">
          {[['Shop', '/products'], ['Our Story', '/story']].map(([label, href]) => (
            <Link key={label} href={href}
              className="label-tag transition-colors"
              style={{ color: '#555550', letterSpacing: '0.12em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555550')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative transition-opacity hover:opacity-70" style={{ color: '#1A1A1A' }}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-semibold"
                style={{ backgroundColor: '#B8860B' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
