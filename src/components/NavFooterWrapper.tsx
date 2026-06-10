'use client';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function NavFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Nav />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
