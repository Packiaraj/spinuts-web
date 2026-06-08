'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { PageLoader } from '@/components/SpiceLoader';
import { Product, Category } from '@/lib/types';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'spices', label: 'Spices' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'millets', label: 'Millets' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
];

const TRUST_ICONS = ['⟡', '◈', '✦', '◎'];

interface SiteContent {
  hero_headline: string;
  hero_subtext: string;
  hero_cta: string;
  story_headline: string;
  story_body1: string;
  story_body2: string;
  gift_title: string;
  gift_subtitle: string;
  trust_1_label: string; trust_1_sub: string;
  trust_2_label: string; trust_2_sub: string;
  trust_3_label: string; trust_3_sub: string;
  trust_4_label: string; trust_4_sub: string;
  banner_tag: string;
}

const DEFAULT_CONTENT: SiteContent = {
  hero_headline: 'Pure spices.\nReal origin.\nNo middlemen.',
  hero_subtext: 'Whole spices and nuts sourced directly from the forests and farms of the Western Ghats. Unprocessed, unadulterated, and delivered to your door.',
  hero_cta: 'Shop All Products',
  story_headline: "From the heart of\nthe Western Ghats.",
  story_body1: "SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced. We work directly with farmers and forest communities deep in the Western Ghats — one of the world's richest biodiversity hotspots — cutting out every layer of middlemen so you get the real thing.",
  story_body2: "Every batch is traceable to its source. Every product is packed within days of harvest. That's the SpiNuts promise.",
  gift_title: 'Gift boxes available',
  gift_subtitle: 'Curated spice and nut collections from the Western Ghats, beautifully packed.',
  trust_1_label: 'Farm Direct', trust_1_sub: 'No middlemen',
  trust_2_label: 'Western Ghats', trust_2_sub: 'Biodiversity hotspot',
  trust_3_label: 'Whole & Pure', trust_3_sub: 'Unprocessed, natural',
  trust_4_label: 'Pan India', trust_4_sub: 'Fast delivery',
  banner_tag: 'Gift Special',
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    async function fetchAll() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const [prodRes, contentRes] = await Promise.all([
          supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false }),
          supabase.from('site_content').select('key, value'),
        ]);
        if (prodRes.data) setProducts(prodRes.data);
        if (contentRes.data?.length) {
          const map = Object.fromEntries(contentRes.data.map((r: { key: string; value: string }) => [r.key, r.value]));
          setContent((prev) => ({ ...prev, ...map }));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
  const trustItems = [
    { label: content.trust_1_label, sub: content.trust_1_sub },
    { label: content.trust_2_label, sub: content.trust_2_sub },
    { label: content.trust_3_label, sub: content.trust_3_sub },
    { label: content.trust_4_label, sub: content.trust_4_sub },
  ];

  return (
    <div style={{ backgroundColor: '#FAFAF8' }}>

      {/* ── Hero ── */}
      <section style={{ backgroundColor: '#111110', color: '#F5F3EE' }} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-40 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label-tag mb-6" style={{ color: '#B8860B', letterSpacing: '0.2em' }}>
              Western Ghats · Forest to Table
            </p>
            <h1 className="text-5xl md:text-7xl mb-8 leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, whiteSpace: 'pre-line', color: '#F5F3EE' }}>
              {content.hero_headline}
            </h1>
            <p className="text-base mb-10 leading-relaxed" style={{ color: 'rgba(245,243,238,0.6)', maxWidth: 400 }}>
              {content.hero_subtext}
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 label-tag transition-all hover:gap-5"
              style={{ backgroundColor: '#B8860B', color: '#111110', letterSpacing: '0.14em' }}>
              {content.hero_cta} <span>→</span>
            </Link>
          </div>
          {/* Decorative right side */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #B8860B, transparent)' }} />
              <div className="absolute inset-8 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(184,134,11,0.2)' }}>
                <div className="text-center">
                  <p className="text-7xl mb-3">🌶️</p>
                  <p className="label-tag" style={{ color: 'rgba(184,134,11,0.6)', letterSpacing: '0.2em' }}>Pure · Whole · Real</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(184,134,11,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E5DF', borderTop: '1px solid #E8E5DF' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-0">
          {trustItems.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-2" style={{ borderRight: i < 3 ? '1px solid #E8E5DF' : 'none' }}>
              <span style={{ color: '#B8860B', fontSize: '1rem' }}>{TRUST_ICONS[i]}</span>
              <div>
                <p className="label-tag" style={{ color: '#1A1A1A', fontSize: '0.6rem' }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#999990' }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-tag mb-2" style={{ color: '#B8860B' }}>Our Collection</p>
              <h2 className="text-3xl" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400 }}>Sourced with care</h2>
            </div>
            <Link href="/products" className="label-tag transition-opacity hover:opacity-60" style={{ color: '#1A1A1A' }}>
              View all →
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="label-tag px-4 py-2 transition-all"
                style={activeCategory === cat.id
                  ? { backgroundColor: '#1A1A1A', color: '#F5F3EE', border: '1px solid #1A1A1A' }
                  : { backgroundColor: 'transparent', color: '#555550', border: '1px solid #E8E5DF' }}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? <PageLoader /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ backgroundColor: '#111110', color: '#F5F3EE' }} className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="aspect-square overflow-hidden relative" style={{ border: '1px solid rgba(245,243,238,0.08)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
              alt="Spices from the Western Ghats" className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
              <p className="label-tag" style={{ color: 'rgba(184,134,11,0.8)', letterSpacing: '0.18em' }}>Western Ghats · Forest to Table</p>
            </div>
          </div>
          <div>
            <p className="label-tag mb-5" style={{ color: '#B8860B', letterSpacing: '0.18em' }}>Our Story</p>
            <h2 className="text-4xl mb-8 leading-snug" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, whiteSpace: 'pre-line', color: '#F5F3EE' }}>
              {content.story_headline}
            </h2>
            <p className="text-sm mb-5 leading-loose" style={{ color: 'rgba(245,243,238,0.6)' }}>{content.story_body1}</p>
            <p className="text-sm mb-10 leading-loose" style={{ color: 'rgba(245,243,238,0.6)' }}>{content.story_body2}</p>
            <Link href="/story" className="label-tag transition-opacity hover:opacity-60"
              style={{ color: '#B8860B', borderBottom: '1px solid rgba(184,134,11,0.4)', paddingBottom: 3 }}>
              Read our full story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gift CTA ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E5DF' }} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 overflow-hidden" style={{ border: '1px solid #E8E5DF' }}>
            <div className="p-12" style={{ backgroundColor: '#F4F1EB' }}>
              <span className="label-tag px-3 py-1.5 mb-6 inline-block"
                style={{ backgroundColor: '#B8860B', color: '#FFFFFF', letterSpacing: '0.16em' }}>
                {content.banner_tag}
              </span>
              <h3 className="text-3xl mb-4" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400 }}>
                {content.gift_title}
              </h3>
              <p className="text-sm mb-8" style={{ color: '#555550', lineHeight: 1.8 }}>{content.gift_subtitle}</p>
              <Link href="/products"
                className="inline-flex items-center gap-3 label-tag px-7 py-3.5 transition-all hover:gap-5"
                style={{ backgroundColor: '#1A1A1A', color: '#F5F3EE', letterSpacing: '0.14em' }}>
                Shop Gift Boxes →
              </Link>
            </div>
            <div className="p-12 flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF' }}>
              {[
                { icon: '🌶️', title: 'The Spice Lover', desc: 'Whole pepper, cardamom, cloves and more.' },
                { icon: '🥜', title: 'The Nut Collection', desc: 'Premium cashews, almonds, pistachios.' },
                { icon: '🌿', title: 'The Forest Harvest', desc: 'Rare finds from deep in the Ghats.' },
              ].map((g) => (
                <div key={g.title} className="flex items-start gap-4 py-4" style={{ borderBottom: '1px solid #E8E5DF' }}>
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className="label-tag mb-1" style={{ color: '#1A1A1A' }}>{g.title}</p>
                    <p className="text-xs" style={{ color: '#999990' }}>{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
