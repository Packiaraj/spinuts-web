'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart2, FileText, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: BarChart2 },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-white flex flex-col"
      style={{ borderRight: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div className="px-6 py-5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
        <p className="font-medium text-sm" style={{ color: '#1B4332', fontWeight: 500 }}>SPINUTS</p>
        <p className="label-tag text-gray-400 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-6 py-3 text-sm transition-colors"
              style={{ color: active ? '#1B4332' : '#888', fontWeight: active ? 500 : 400,
                backgroundColor: active ? 'rgba(27,67,50,0.06)' : 'transparent' }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-gray-400 hover:text-red-500 transition-colors"
        style={{ borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <LogOut size={16} />
        Sign Out
      </button>
    </aside>
  );
}
