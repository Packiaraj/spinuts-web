import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A0E05', color: '#FDF6EE' }}>
      {/* Top band */}
      <div style={{ backgroundColor: '#B8860B', padding: '14px 24px', textAlign: 'center' }}>
        <p className="tag" style={{ color: '#FBF5EC', letterSpacing: '0.2em', fontSize: '0.6rem' }}>
          🌶️ Pure Indian Spices · Est. 2024 · Organic · Premium · Artisanal 🥜
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 flex items-start gap-6">
            {/* Logo */}
            <Image src="/logo.png" alt="SpiNuts" width={180} height={180} style={{ objectFit: 'contain', flexShrink: 0 }} />
            {/* Text */}
            <div className="pt-2">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#FDF6EE', marginBottom: 4 }}>SpiNuts</p>
              <p className="tag" style={{ color: '#B8860B', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: 14 }}>Pure Indian Spices · Est. 2024</p>
              <p style={{ color: 'rgba(253,246,238,0.5)', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 260 }}>
                Crafted blends of pure Indian spices &amp; premium nuts. Organic, artisanal, delivered straight from Indian farms to your kitchen.
              </p>
              <div className="flex gap-4 mt-5">
                {['Instagram', 'Facebook'].map((s) => (
                  <a key={s} href="#" className="tag transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(253,246,238,0.4)', fontSize: '0.6rem' }}>
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="tag mb-5" style={{ color: 'rgba(253,246,238,0.3)' }}>Shop</p>
            {['Spices', 'Nuts', 'Seeds', 'Millets', 'Dry Fruits'].map((item) => (
              <Link key={item} href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                className="block text-sm mb-3 transition-opacity hover:opacity-100"
                style={{ color: 'rgba(253,246,238,0.55)' }}>
                {item}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="tag mb-5" style={{ color: 'rgba(253,246,238,0.3)' }}>Company</p>
            {[['Our Story', '/story'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href}
                className="block text-sm mb-3 transition-opacity hover:opacity-100"
                style={{ color: 'rgba(253,246,238,0.55)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(253,246,238,0.07)' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(253,246,238,0.25)' }}>
            © 2025 SpiNuts. All rights reserved.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(253,246,238,0.25)' }}>spinuts.store</p>
        </div>
      </div>
    </footer>
  );
}
