import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111110', color: '#F5F3EE' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 400, color: '#F5F3EE' }}>
              SpiNuts
            </p>
            <p className="label-tag mt-1 mb-5" style={{ color: '#B8860B', letterSpacing: '0.18em' }}>Western Ghats</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,243,238,0.5)', maxWidth: 240 }}>
              Sourced directly from real farmers of the Western Ghats. Whole, pure, and unadulterated.
            </p>
          </div>

          <div>
            <p className="label-tag mb-5" style={{ color: 'rgba(245,243,238,0.3)' }}>Shop</p>
            {['Spices', 'Nuts', 'Seeds', 'Millets', 'Dry Fruits'].map((item) => (
              <Link key={item} href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                className="block text-sm mb-3 transition-opacity hover:opacity-100"
                style={{ color: 'rgba(245,243,238,0.55)' }}>
                {item}
              </Link>
            ))}
          </div>

          <div>
            <p className="label-tag mb-5" style={{ color: 'rgba(245,243,238,0.3)' }}>Company</p>
            {[['Our Story', '/story'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href}
                className="block text-sm mb-3 transition-opacity hover:opacity-100"
                style={{ color: 'rgba(245,243,238,0.55)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(245,243,238,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(245,243,238,0.3)' }}>
            © 2025 SpiNuts. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(245,243,238,0.3)' }}>spinuts.store</p>
        </div>
      </div>
    </footer>
  );
}
