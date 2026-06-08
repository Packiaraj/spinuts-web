'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { PageLoader } from '@/components/SpiceLoader';
import { Product, Category } from '@/lib/types';

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '✦' },
  { id: 'spices', label: 'Spices', emoji: '🌶️' },
  { id: 'nuts', label: 'Nuts', emoji: '🥜' },
  { id: 'seeds', label: 'Seeds', emoji: '🌱' },
  { id: 'millets', label: 'Millets', emoji: '🌾' },
  { id: 'dry-fruits', label: 'Dry Fruits', emoji: '🍇' },
];

const TRUST = [
  { icon: '🌿', label: 'Farm Direct', sub: 'No middlemen, ever' },
  { icon: '🏔️', label: 'Western Ghats', sub: 'Biodiversity hotspot' },
  { icon: '✦', label: 'Whole & Pure', sub: 'Unprocessed, natural' },
  { icon: '🚚', label: 'Pan India', sub: 'Fast, careful delivery' },
];

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ── Sub-components that safely call hooks ── */

function TrustBar() {
  const ref = useReveal(0.1);
  return (
    <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8D9C8', borderTop: '1px solid #E8D9C8' }}>
      <div ref={ref} className="reveal max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4">
        {TRUST.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3"
            style={{ borderRight: i < 3 ? '1px solid #E8D9C8' : 'none' }}>
            <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
            <div>
              <p className="tag" style={{ color: '#2C1A0E', fontSize: '0.6rem' }}>{t.label}</p>
              <p style={{ fontSize: '0.75rem', color: '#8B6F5E', marginTop: 2 }}>{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  const leftRef = useReveal(0.1);
  const rightRef = useReveal(0.1);
  return (
    <section style={{ backgroundColor: '#2C1A0E' }} className="py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div ref={leftRef} className="reveal-left aspect-[4/5] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
            alt="Western Ghats spices"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) saturate(1.1)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(196,120,58,0.15) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '24px', background: 'linear-gradient(to top, rgba(44,26,14,0.8), transparent)',
          }}>
            <p className="tag" style={{ color: 'rgba(212,168,83,0.9)', letterSpacing: '0.18em' }}>
              Western Ghats · Forest Farms
            </p>
          </div>
        </div>

        <div ref={rightRef} className="reveal-right">
          <p className="tag mb-5" style={{ color: '#C4783A', letterSpacing: '0.18em' }}>Our Story</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#FDF6EE', marginBottom: 24,
          }}>
            From the heart of<br />
            <em style={{ color: '#D4A853' }}>the Western Ghats.</em>
          </h2>
          <p style={{ color: 'rgba(253,246,238,0.6)', lineHeight: 1.85, marginBottom: 18, fontSize: '0.95rem' }}>
            SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced. We work directly with farmers and forest communities deep in the Western Ghats — one of the world&apos;s richest biodiversity hotspots.
          </p>
          <p style={{ color: 'rgba(253,246,238,0.6)', lineHeight: 1.85, marginBottom: 36, fontSize: '0.95rem' }}>
            Every batch is traceable to its source. Every product is packed within days of harvest. That&apos;s the SpiNuts promise.
          </p>
          <Link href="/story"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-4"
            style={{ color: '#C4783A', borderBottom: '1px solid rgba(196,120,58,0.4)', paddingBottom: 4 }}>
            Read our full story →
          </Link>
        </div>
      </div>
    </section>
  );
}

function GiftSection() {
  const ref = useReveal(0.1);
  return (
    <section style={{ backgroundColor: '#FDF6EE' }} className="py-20 px-6">
      <div ref={ref} className="reveal max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 overflow-hidden"
          style={{ border: '1px solid #E8D9C8', borderRadius: 4 }}>
          <div className="p-12" style={{ backgroundColor: '#2C1A0E' }}>
            <span className="tag px-3 py-1.5 mb-6 inline-block"
              style={{ backgroundColor: '#C4783A', color: '#fff', borderRadius: 2 }}>
              Gift Special
            </span>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', color: '#FDF6EE', marginBottom: 16,
            }}>
              Gift boxes available
            </h3>
            <p style={{ color: 'rgba(253,246,238,0.6)', lineHeight: 1.8, marginBottom: 32, fontSize: '0.9rem' }}>
              Curated spice & nut collections from the Western Ghats, beautifully packed — perfect for every occasion.
            </p>
            <Link href="/products" className="btn-cinnamon">
              Shop Gift Boxes →
            </Link>
          </div>
          <div className="p-12 flex flex-col justify-center gap-0" style={{ backgroundColor: '#FFFFFF' }}>
            {[
              { icon: '🌶️', title: 'The Spice Lover', desc: 'Whole pepper, cardamom, cloves & more.' },
              { icon: '🥜', title: 'The Nut Collection', desc: 'Premium cashews, almonds, pistachios.' },
              { icon: '🌿', title: 'The Forest Harvest', desc: 'Rare finds from deep in the Ghats.' },
            ].map((g) => (
              <div key={g.title} className="flex items-start gap-4 py-5"
                style={{ borderBottom: '1px solid #E8D9C8' }}>
                <span style={{ fontSize: '1.8rem' }}>{g.icon}</span>
                <div>
                  <p className="tag mb-1" style={{ color: '#2C1A0E' }}>{g.title}</p>
                  <p style={{ fontSize: '0.82rem', color: '#8B6F5E' }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main page ── */
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const productsRef = useReveal(0.05);

  useEffect(() => {
    async function fetchAll() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase
          .from('products').select('*').eq('active', true)
          .order('created_at', { ascending: false });
        if (data) setProducts(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div style={{ backgroundColor: '#FDF6EE' }}>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#2C1A0E', minHeight: '92vh', position: 'relative', overflow: 'hidden' }}
        className="flex items-center">
        {/* Dot texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #FDF6EE 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Warm glow */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          width: 520, height: 520,
          background: 'radial-gradient(circle, rgba(196,120,58,0.2) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div className="max-w-7xl mx-auto px-6 py-20 w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="hero-line-1 tag mb-6" style={{ color: '#C4783A', letterSpacing: '0.2em' }}>
              Western Ghats · Forest to Table
            </p>
            <h1 className="hero-line-2 mb-7" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              color: '#FDF6EE', fontWeight: 700, lineHeight: 1.08,
            }}>
              Pure spices.<br />
              <em style={{ color: '#D4A853', fontStyle: 'italic' }}>Real</em> origin.<br />
              No middlemen.
            </h1>
            <p className="hero-line-3 mb-10" style={{
              color: 'rgba(253,246,238,0.6)', maxWidth: 400,
              fontSize: '1rem', lineHeight: 1.8,
            }}>
              Whole spices & nuts sourced directly from the forests and farms of the Western Ghats — unprocessed and unadulterated.
            </p>
            <div className="hero-line-4 flex flex-wrap gap-4">
              <Link href="/products" className="btn-cinnamon">Shop Now →</Link>
              <Link href="/story" className="btn-outline">Our Story</Link>
            </div>
          </div>

          {/* Logo showcase */}
          <div className="hidden md:flex items-center justify-center hero-line-2">
            <div style={{ position: 'relative', width: 340, height: 340 }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'absolute', inset: -20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(196,120,58,0.15) 0%, transparent 70%)',
              }} />
              {/* Dashed orbit */}
              <div style={{
                position: 'absolute', inset: -10,
                borderRadius: '50%',
                border: '1px dashed rgba(196,120,58,0.2)',
              }} />
              {/* Logo circle with cream bg */}
              <div style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                backgroundColor: '#FDF6EE',
                border: '2px solid rgba(196,120,58,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(44,26,14,0.4)',
              }}>
                <Image
                  src="/logo.png"
                  alt="SpiNuts"
                  width={300}
                  height={300}
                  style={{ objectFit: 'contain', padding: 12 }}
                  priority
                />
              </div>
              {/* Floating badges */}
              {[
                { emoji: '🥜', label: 'Nuts', top: '2%', left: '70%' },
                { emoji: '🌿', label: 'Pure', top: '78%', left: '72%' },
                { emoji: '🌾', label: 'Whole', top: '80%', left: '-2%' },
              ].map((b) => (
                <div key={b.label} style={{
                  position: 'absolute', top: b.top, left: b.left,
                  backgroundColor: 'rgba(44,26,14,0.95)',
                  border: '1px solid rgba(196,120,58,0.35)',
                  borderRadius: 8, padding: '7px 11px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: '1rem' }}>{b.emoji}</span>
                  <span className="tag" style={{ color: '#FDF6EE', fontSize: '0.52rem' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }} className="hero-line-4">
          <p className="tag" style={{ color: 'rgba(253,246,238,0.3)', fontSize: '0.52rem' }}>Scroll</p>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(196,120,58,0.5), transparent)' }} />
        </div>
      </section>

      {/* ── TRUST ── */}
      <TrustBar />

      {/* ── PRODUCTS ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={productsRef} className="reveal">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="tag mb-2" style={{ color: '#C4783A' }}>Our Collection</p>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: '#2C1A0E' }}>
                  Sourced with care
                </h2>
              </div>
              <Link href="/products" className="text-sm font-medium"
                style={{ color: '#C4783A', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                View all →
              </Link>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 mb-10 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="text-sm font-medium px-4 py-2 transition-all duration-200"
                  style={activeCategory === cat.id
                    ? { backgroundColor: '#2C1A0E', color: '#FDF6EE', border: '1.5px solid #2C1A0E', borderRadius: 2 }
                    : { backgroundColor: 'transparent', color: '#8B6F5E', border: '1.5px solid #E8D9C8', borderRadius: 2 }
                  }>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? <PageLoader /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <div key={product.id} className="reveal" style={{
                  opacity: 0, transform: 'translateY(24px)',
                  transition: `opacity 0.5s ease ${(i % 8) * 0.07}s, transform 0.5s ease ${(i % 8) * 0.07}s`,
                }}
                  ref={(el) => {
                    if (!el) return;
                    const obs = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        obs.disconnect();
                      }
                    }, { threshold: 0.1 });
                    obs.observe(el);
                  }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STORY ── */}
      <StorySection />

      {/* ── GIFT ── */}
      <GiftSection />

    </div>
  );
}
