'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'spices', label: 'Spices' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'millets', label: 'Millets' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
];

const TRUST_SIGNALS = [
  { icon: '🌿', label: 'Farm Direct', sub: 'No middlemen' },
  { icon: '🏔️', label: 'Kerala Origin', sub: 'Certified source' },
  { icon: '✦', label: 'Whole Spices', sub: 'Unprocessed, pure' },
  { icon: '📦', label: 'Pan India', sub: 'Fast delivery' },
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Black Pepper Whole', description: 'Bold, pungent whole black pepper from the hills of Wayanad, Kerala.',
    price_inr: 320, price_usd: 4, original_price_inr: 420, original_price_usd: 5,
    category: 'spices', weight: '100g', stock: 50, images: [], origin: 'Wayanad, Kerala', active: true, created_at: '',
  },
  {
    id: '2', name: 'Cardamom Green', description: 'Intensely aromatic green cardamom pods hand-picked from Idukki.',
    price_inr: 580, price_usd: 7, original_price_inr: 750, original_price_usd: 9,
    category: 'spices', weight: '50g', stock: 30, images: [], origin: 'Idukki, Kerala', active: true, created_at: '',
  },
  {
    id: '3', name: 'Cashews W240', description: 'Whole cashews, premium W240 grade, sourced from Kollam.',
    price_inr: 850, price_usd: 10, original_price_inr: 1050, original_price_usd: 13,
    category: 'nuts', weight: '250g', stock: 40, images: [], origin: 'Kollam, Kerala', active: true, created_at: '',
  },
  {
    id: '4', name: 'Cloves Whole', description: 'Fragrant whole cloves with high eugenol content from Thrissur.',
    price_inr: 240, price_usd: 3, original_price_inr: 300, original_price_usd: 4,
    category: 'spices', weight: '50g', stock: 60, images: [], origin: 'Thrissur, Kerala', active: true, created_at: '',
  },
  {
    id: '5', name: 'Ragi / Finger Millet', description: 'Nutrient-dense finger millet from traditional farms in Tamil Nadu.',
    price_inr: 180, price_usd: 2, category: 'millets', weight: '500g',
    stock: 80, images: [], origin: 'Salem, Tamil Nadu', active: true, created_at: '',
  },
  {
    id: '6', name: 'Almonds Raw', description: 'Raw, unsalted whole almonds — rich in healthy fats and protein.',
    price_inr: 720, price_usd: 9, original_price_inr: 900, original_price_usd: 11,
    category: 'nuts', weight: '250g', stock: 35, images: [], origin: 'Imported, Packed in India', active: true, created_at: '',
  },
  {
    id: '7', name: 'Cumin Seeds', description: 'Earthy, warm cumin seeds from the spice heartland of Rajasthan.',
    price_inr: 150, price_usd: 2, category: 'seeds', weight: '100g',
    stock: 90, images: [], origin: 'Rajasthan', active: true, created_at: '',
  },
  {
    id: '8', name: 'Dates Medjool', description: 'Soft, caramel-sweet Medjool dates, premium grade.',
    price_inr: 650, price_usd: 8, original_price_inr: 800, original_price_usd: 10,
    category: 'dry-fruits', weight: '250g', stock: 25, images: [], origin: 'Imported, Packed in India', active: true, created_at: '',
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        console.error('Failed to load products:', e);
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }} className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="label-tag mb-6" style={{ color: '#D4A017' }}>Kerala · Tamil Nadu · South India</p>
          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ maxWidth: 700, fontWeight: 500 }}>
            Pure spices.<br />Real origin.<br />No middlemen.
          </h1>
          <p className="text-base mb-10" style={{ color: 'rgba(255,248,240,0.75)', maxWidth: 440, lineHeight: 1.7 }}>
            Family-sourced whole spices and nuts directly from Kerala and Tamil Nadu farms.
            Unprocessed, unadulterated, and delivered to your door.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4A017', color: '#1B4332', letterSpacing: '0.08em', fontSize: '0.8rem', textTransform: 'uppercase' }}
          >
            Shop All Products
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 px-6" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_SIGNALS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
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

          {/* Category pills */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <div className="aspect-square" style={{ backgroundColor: '#f0ebe5' }} />
                  <div className="p-4 space-y-2">
                    <div className="h-2 rounded" style={{ backgroundColor: '#ede8e2', width: '40%' }} />
                    <div className="h-3 rounded" style={{ backgroundColor: '#ede8e2', width: '80%' }} />
                    <div className="h-2 rounded" style={{ backgroundColor: '#ede8e2', width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
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
            <h2 className="text-3xl font-medium mb-6 leading-snug" style={{ fontWeight: 500 }}>
              From our family&apos;s farms<br />to your kitchen.
            </h2>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,248,240,0.75)', lineHeight: 1.8 }}>
              SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced.
              Our family has been working directly with farmers in Kerala and Tamil Nadu for generations,
              cutting out every layer of middlemen so you get the real thing.
            </p>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,248,240,0.75)', lineHeight: 1.8 }}>
              Every batch is traceable to its farm. Every product is packed within days of harvest.
              That&apos;s the SpiNuts promise.
            </p>
            <Link href="/story" className="label-tag" style={{ color: '#D4A017', borderBottom: '0.5px solid #D4A017', paddingBottom: 2 }}>
              Read Our Story →
            </Link>
          </div>
          <div className="aspect-square flex items-center justify-center"
            style={{ backgroundColor: '#0F2D22', border: '0.5px solid rgba(255,248,240,0.1)' }}>
            <div className="text-center">
              <p className="text-6xl mb-4">🌿</p>
              <p className="label-tag" style={{ color: 'rgba(255,248,240,0.4)' }}>Kerala Farms</p>
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
                Diwali Special
              </span>
              <h3 className="text-2xl font-medium" style={{ fontWeight: 500 }}>Gift boxes available</h3>
              <p className="text-sm text-gray-600 mt-2">Curated spice and nut collections, beautifully packed.</p>
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
