'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/AdminNav';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  ordersToday: number;
  totalProducts: number;
  totalCustomers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, ordersToday: 0, totalProducts: 0, totalCustomers: 0 });

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const today = new Date().toISOString().split('T')[0];
        const [orders, products, customers] = await Promise.all([
          supabase.from('orders').select('total, created_at'),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('customers').select('id', { count: 'exact' }),
        ]);
        const totalRevenue = orders.data?.reduce((s, o) => s + (o.total || 0), 0) || 0;
        const ordersToday = orders.data?.filter((o) => o.created_at?.startsWith(today)).length || 0;
        setStats({
          totalRevenue,
          ordersToday,
          totalProducts: products.count || 0,
          totalCustomers: customers.count || 0,
        });
      } catch { /* no Supabase */ }
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#1B4332' },
    { label: 'Orders Today', value: stats.ordersToday, icon: ShoppingCart, color: '#D4A017' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: '#1B4332' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: '#1B4332' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-xl font-medium" style={{ fontWeight: 500 }}>Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back to SpiNuts Admin</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-5" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="label-tag text-gray-400">{label}</p>
                <Icon size={16} color={color} />
              </div>
              <p className="text-2xl font-medium" style={{ fontWeight: 500, color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['/admin/products', 'Add Product'],
              ['/admin/orders', 'View Orders'],
              ['/admin/customers', 'View Customers'],
            ].map(([href, label]) => (
              <a key={label} href={href} className="label-tag px-4 py-2 transition-colors hover:bg-[#1B4332] hover:text-white"
                style={{ border: '0.5px solid #1B4332', color: '#1B4332' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
