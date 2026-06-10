'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'Spices', 'Nuts', 'Seeds', 'Millets', 'Dry Fruits'];

const ANNOUNCEMENTS = [
  '🌶️ Free shipping on orders above ₹499',
  '✦ Use code SPINUTS10 for 10% off your first order',
  '🥜 New arrivals: Premium Cashews & Cardamom — Shop Now',
  '🌿 100% Organic · No preservatives · Farm direct',
];

export default function Nav() {
  const cartCount = useStore((s) => s.cartCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [announceFade, setAnnounceFade] = useState(true);
  const catRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Rotate announcement every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setAnnounceFade(false);
      setTimeout(() => {
        setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
        setAnnounceFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cat = selectedCat === 'All' ? '' : `&category=${selectedCat.toLowerCase().replace(' ', '-')}`;
    router.push(`/products?search=${encodeURIComponent(query)}${cat}`);
  }

  return (
    <>
      {/* ── Announcement bar ── */}
      <div style={{ backgroundColor: '#B8860B', padding: '8px 16px', textAlign: 'center', overflow: 'hidden' }}>
        <p
          className="tag"
          style={{
            color: '#FBF5EC',
            letterSpacing: '0.12em',
            fontSize: '0.65rem',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: announceFade ? 1 : 0,
            transform: announceFade ? 'translateY(0)' : 'translateY(-6px)',
          }}
        >
          {ANNOUNCEMENTS[announcementIdx]}
        </p>
      </div>

      {/* ── Main nav ── */}
      <nav className="sticky top-0 z-50 bg-white" style={{ borderBottom: '1px solid #F0E6D6' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-4" style={{ height: '68px' }}>

          {/* Hamburger (mobile) */}
          <button className="md:hidden flex-shrink-0" onClick={() => setMenuOpen(true)} style={{ color: '#2C1708' }}>
            <Menu size={22} strokeWidth={1.8} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="SpiNuts" width={52} height={52}
              style={{ objectFit: 'contain', borderRadius: '50%' }} />
          </Link>

          {/* Category + Search bar — grows to fill space */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center"
            style={{
              border: '1.5px solid #DEC9A8',
              borderRadius: 6,
              overflow: 'hidden',
              backgroundColor: '#FDFAF6',
              maxWidth: 720,
            }}>
            {/* Category dropdown */}
            <div ref={catRef} className="relative hidden md:flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 px-4 text-sm font-medium h-full"
                style={{
                  color: '#2C1708',
                  borderRight: '1.5px solid #DEC9A8',
                  height: 42,
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedCat} <ChevronDown size={14} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg z-50"
                  style={{ border: '1px solid #F0E6D6', borderRadius: 4, minWidth: 140 }}>
                  {CATEGORIES.map((c) => (
                    <button key={c} type="button"
                      onClick={() => { setSelectedCat(c); setCatOpen(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors"
                      style={{ color: selectedCat === c ? '#B5631A' : '#2C1708', fontWeight: selectedCat === c ? 600 : 400 }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-4 text-sm bg-transparent outline-none"
              style={{ height: 42, color: '#2C1708' }}
            />

            {/* Search button */}
            <button type="submit" className="flex items-center justify-center flex-shrink-0 px-4 h-full transition-colors hover:bg-amber-50"
              style={{ color: '#B5631A' }}>
              <Search size={18} strokeWidth={2} />
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {[['Shop', '/products'], ['Our Story', '/story']].map(([label, href]) => (
                <Link key={label} href={href}
                  className="text-sm font-medium relative group"
                  style={{ color: '#2C1708' }}>
                  {label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: '#B8860B' }} />
                </Link>
              ))}
            </div>
            <Link href="/account" className="hidden md:block" style={{ color: '#2C1708' }}>
              <User size={20} strokeWidth={1.7} />
            </Link>
            <Link href="/cart" className="relative" style={{ color: '#2C1708' }}>
              <ShoppingBag size={21} strokeWidth={1.7} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#B8860B', fontSize: '9px' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#2C1708' }}>
          <div className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: '1px solid rgba(251,245,236,0.1)' }}>
            <Image src="/logo.png" alt="SpiNuts" width={44} height={44} style={{ objectFit: 'contain', borderRadius: '50%' }} />
            <button onClick={() => setMenuOpen(false)} style={{ color: '#FBF5EC' }}>
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Mobile search */}
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }}
              className="flex items-center mb-8"
              style={{ border: '1px solid rgba(251,245,236,0.2)', borderRadius: 6, overflow: 'hidden' }}>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 px-4 py-3 text-sm bg-transparent outline-none"
                style={{ color: '#FBF5EC' }} />
              <button type="submit" className="px-4" style={{ color: '#B8860B' }}>
                <Search size={18} />
              </button>
            </form>

            {/* Categories */}
            <p className="tag mb-4" style={{ color: 'rgba(251,245,236,0.4)' }}>Categories</p>
            {CATEGORIES.filter(c => c !== 'All').map((c) => (
              <Link key={c} href={`/products?category=${c.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                className="block py-4 text-lg font-medium border-b"
                style={{ color: '#FBF5EC', borderColor: 'rgba(251,245,236,0.08)', fontFamily: "'Playfair Display', serif" }}>
                {c}
              </Link>
            ))}
            <div className="mt-6">
              {[['Our Story', '/story'], ['Cart', '/cart']].map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                  className="block py-4 text-lg font-medium border-b"
                  style={{ color: 'rgba(251,245,236,0.6)', borderColor: 'rgba(251,245,236,0.08)', fontFamily: "'Playfair Display', serif" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
