'use client';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Nav() {
  const cartCount = useStore((s) => s.cartCount());
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(251,245,236,0.97)' : '#FBF5EC',
          borderBottom: `1px solid ${scrolled ? '#DEC9A8' : '#DEC9A8'}`,
          boxShadow: scrolled ? '0 2px 16px rgba(44,23,8,0.10)' : 'none',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          style={{ height: '60px' }}
        >
          {/* Nav links — centered */}
          <div className="hidden md:flex items-center gap-10">
            {[['Shop', '/products'], ['Our Story', '/story']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="relative text-sm font-medium group"
                style={{ color: '#2C1708' }}
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px transition-all duration-300 w-0 group-hover:w-full"
                  style={{ backgroundColor: '#B8860B' }} />
              </Link>
            ))}
          </div>

          {/* Logo center (only on scroll / desktop) */}
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="SpiNuts"
              width={44}
              height={44}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Right: cart + mobile menu */}
          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative" style={{ color: '#2C1708' }}>
              <ShoppingBag size={20} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-semibold"
                  style={{ backgroundColor: '#B8860B', fontSize: '9px' }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#2C1708' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-20 px-6" style={{ backgroundColor: '#2C1708' }}>
          <div className="flex justify-center mb-10">
            <Image src="/logo.png" alt="SpiNuts" width={90} height={90} style={{ objectFit: 'contain' }} />
          </div>
          {[['Shop', '/products'], ['Our Story', '/story'], ['Cart', '/cart']].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)}
              className="py-5 text-2xl font-medium border-b"
              style={{ fontFamily: "'Playfair Display', serif", color: '#FBF5EC', borderColor: 'rgba(251,245,236,0.1)' }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
