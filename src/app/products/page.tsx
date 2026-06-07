'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';
import { SAMPLE_PRODUCTS } from '@/lib/sampleData';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'spices', label: 'Spices' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'millets', label: 'Millets' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

function ProductsInner() {
  const searchParams = useSearchParams();
  const initCat = (searchParams.get('category') as Category) || 'all';
  const [activeCategory, setActiveCategory] = useState<Category>(initCat);
  const [sort, setSort] = useState('default');
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [maxPrice, setMaxPrice] = useState(2000);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('products').select('*').eq('active', true);
        if (data && data.length > 0) setProducts(data);
      } catch { /* use sample */ }
    }
    fetchProducts();
  }, []);

  let filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  filtered = filtered.filter((p) => p.price_inr <= maxPrice);

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price_inr - b.price_inr);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price_inr - a.price_inr);
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="label-tag mb-2" style={{ color: '#D4A017' }}>Shop</p>
        <h1 className="text-3xl font-medium" style={{ fontWeight: 500 }}>All Products</h1>
      </div>

      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Category</p>
            <div className="space-y-1 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as Category)}
                  className="block w-full text-left text-sm py-1.5 transition-colors"
                  style={{ color: activeCategory === cat.id ? '#1B4332' : '#888', fontWeight: activeCategory === cat.id ? 500 : 400 }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p className="label-tag mb-3" style={{ color: '#1B4332' }}>Max Price (₹)</p>
            <input
              type="range" min={100} max={2000} step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1B4332]"
            />
            <p className="text-sm mt-1 text-gray-600">Up to ₹{maxPrice}</p>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{filtered.length} products</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border py-1.5 px-3 bg-white"
              style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-gray-500 py-20 text-center">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductsInner />
    </Suspense>
  );
}
