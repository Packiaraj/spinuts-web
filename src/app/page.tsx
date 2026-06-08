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

const TRUST_ICONS = ['🌿', '🏔️', '✦', '📦'];

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
        if (contentRes.data && contentRes.data.length > 0) {
          const map = Object.fromEntries(contentRes.data.map((r: { key: string; value: string }) => [r.key, r.value]));
          setContent((prev) => ({ ...prev, ...map }));
        }
      } catch (e) {
        console.error('Failed to load:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const trustItems = [
    { label: content.trust_1_label, sub: content.trust_1_sub },
    { label: content.trust_2_label, sub: content.trust_2_sub },
    { label: content.trust_3_label, sub: content.trust_3_sub },
    { label: content.trust_4_label, sub: content.trust_4_sub },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }} className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="label-tag mb-6" style={{ color: '#D4A017' }}>Western Ghats · Forest to Table</p>
          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ maxWidth: 700, fontWeight: 500, whiteSpace: 'pre-line' }}>
            {content.hero_headline}
          </h1>
          <p className="text-base mb-10" style={{ color: 'rgba(255,248,240,0.75)', maxWidth: 440, lineHeight: 1.7 }}>
            {content.hero_subtext}
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4A017', color: '#1B4332', letterSpacing: '0.08em', fontSize: '0.8rem', textTransform: 'uppercase' }}
          >
            {content.hero_cta}
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 px-6" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{TRUST_ICONS[i]}</span>
              <div>
                <p className="label-tag" style={{ color: '#1B4332' }}>{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium" style={{ fontWeight: 500 }}>Our Products</h2>
            <Link href="/products" className="label-tag" style={{ color: '#1B4332' }}>View All →</Link>
          </div>

          <div className="flex gap-2 mb-10 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="label-tag px-4 py-2 transition-colors"
                style={
                  activeCategory === cat.id
                    ? { backgroundColor: '#1B4332', color: '#FFF8F0', border: '0.5px solid #1B4332' }
                    : { backgroundColor: 'transparent', color: '#555', border: '0.5px solid rgba(0,0,0,0.15)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Story teaser */}
      <section style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }} className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label-tag mb-4" style={{ color: '#D4A017' }}>Our Story</p>
            <h2 className="text-3xl font-medium mb-6 leading-snug" style={{ fontWeight: 500, whiteSpace: 'pre-line' }}>
              {content.story_headline}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,248,240,0.75)', lineHeight: 1.8 }}>
              {content.story_body1}
            </p>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,248,240,0.75)', lineHeight: 1.8 }}>
              {content.story_body2}
            </p>
            <Link href="/story" className="label-tag" style={{ color: '#D4A017', borderBottom: '0.5px solid #D4A017', paddingBottom: 2 }}>
              Read Our Story →
            </Link>
          </div>
          <div className="aspect-square overflow-hidden relative"
            style={{ border: '0.5px solid rgba(255,248,240,0.1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
              alt="Spices from the Western Ghats"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
              <p className="label-tag" style={{ color: 'rgba(255,248,240,0.7)' }}>Western Ghats · Forest to Table</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gift CTA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ border: '0.5px solid #D4A017' }}>
            <div>
              <span className="label-tag px-3 py-1 mb-4 inline-block" style={{ backgroundColor: '#D4A017', color: '#1B4332' }}>
                {content.banner_tag}
              </span>
              <h3 className="text-2xl font-medium" style={{ fontWeight: 500 }}>{content.gift_title}</h3>
              <p className="text-sm text-gray-600 mt-2">{content.gift_subtitle}</p>
            </div>
            <Link href="/products"
              className="label-tag px-8 py-4 whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
              Shop Gift Boxes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
