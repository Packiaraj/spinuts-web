import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A0E05', color: '#FDF6EE' }}>
      {/* Top band */}
      <div style={{ backgroundColor: '#C4783A', padding: '14px 24px', textAlign: 'center' }}>
        <p className="tag" style={{ color: '#FDF6EE', letterSpacing: '0.2em', fontSize: '0.6rem' }}>
          🌶️ Pure Spices · Traditional Blend · Western Ghats · Farm Direct 🥜
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1.5px solid #C4783A', backgroundColor: '#2C1A0E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.2rem' }}>🌶️</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#FDF6EE' }}>
                  SpiNuts
                </p>
                <p className="tag" style={{ color: '#C4783A', fontSize: '0.52rem', marginTop: 1 }}>Western Ghats</p>
              </div>
            </div>
            <p style={{ color: 'rgba(253,246,238,0.5)', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 280 }}>
              Sourced directly from real farmers of the Western Ghats. Whole, pure, and unadulterated — from forest to your kitchen.
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
