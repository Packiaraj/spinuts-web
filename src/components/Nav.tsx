'use client';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';

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
          backgroundColor: scrolled ? 'rgba(253,246,238,0.97)' : '#FDF6EE',
          borderBottom: `1px solid ${scrolled ? '#E8D9C8' : 'transparent'}`,
          boxShadow: scrolled ? '0 2px 20px rgba(44,26,14,0.08)' : 'none',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300"
          style={{ height: scrolled ? '60px' : '72px' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="transition-all duration-300 flex items-center justify-center rounded-full"
              style={{
                width: scrolled ? 36 : 44,
                height: scrolled ? 36 : 44,
                border: '1.5px solid #C4783A',
                backgroundColor: '#2C1A0E',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: scrolled ? '1rem' : '1.2rem' }}>🌶️</span>
            </div>
            <div className="leading-none">
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: scrolled ? '1.1rem' : '1.25rem',
                color: '#2C1A0E',
                letterSpacing: '-0.01em',
                transition: 'font-size 0.3s',
              }}>
                SpiNuts
              </p>
              <p className="tag" style={{ color: '#C4783A', fontSize: '0.52rem', marginTop: 1 }}>
                Western Ghats
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[['Shop', '/products'], ['Our Story', '/story']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="relative text-sm font-medium transition-colors group"
                style={{ color: '#2C1A0E' }}
              >
                {label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px bg-cinnamon transition-all duration-300 w-0 group-hover:w-full"
                  style={{ backgroundColor: '#C4783A' }}
                />
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative" style={{ color: '#2C1A0E' }}>
              <ShoppingBag size={20} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-semibold"
                  style={{ backgroundColor: '#C4783A', fontSize: '9px' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: '#2C1A0E' }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20 px-6"
          style={{ backgroundColor: '#2C1A0E' }}
        >
          {[['Shop', '/products'], ['Our Story', '/story'], ['Cart', '/cart']].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-5 text-2xl font-medium border-b"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FDF6EE',
                borderColor: 'rgba(253,246,238,0.1)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
