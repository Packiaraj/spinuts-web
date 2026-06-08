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
  { icon: '🌿', label: 'Organic', sub: 'No chemicals, ever' },
  { icon: '⭐', label: 'Premium Quality', sub: 'Carefully handpicked' },
  { icon: '🏺', label: 'Artisanal', sub: 'Traditional methods' },
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
            <p className="tag" style={{ color: 'rgba(212,168,42,0.9)', letterSpacing: '0.18em' }}>
              Pure Indian Spices · Est. 2024
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
            From Indian farms<br />
            <em style={{ color: '#D4A82A' }}>to your kitchen.</em>
          </h2>
          <p style={{ color: 'rgba(253,246,238,0.6)', lineHeight: 1.85, marginBottom: 18, fontSize: '0.95rem' }}>
            SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced. We work directly with Indian farmers and communities — bringing you pure, authentic flavours without any middlemen.
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
    <div style={{ backgroundColor: '#FBF5EC' }}>

      {/* ── HERO: full banner image only ── */}
      <section className="hero-line-1 relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banner.jpg"
          alt="SpiNuts — Pure Indian Spices & Premium Nuts"
          className="w-full block"
          style={{ objectFit: 'cover' }}
        />
        {/* Transparent click overlay on the baked-in "SHOP OUR BLENDS" button */}
        <Link
          href="/products"
          aria-label="Shop Our Blends"
          style={{
            position: 'absolute',
            top: '38%',
            left: '52%',
            width: '43%',
            height: '10%',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        />
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
