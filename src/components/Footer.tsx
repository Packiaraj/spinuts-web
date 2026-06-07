import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F2D22', color: '#FFF8F0' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="text-xl font-500 mb-1" style={{ fontWeight: 500, letterSpacing: '0.05em' }}>SPINUTS</p>
            <p className="label-tag" style={{ color: '#D4A017' }}>by Amigoz</p>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,248,240,0.6)', maxWidth: 260 }}>
              Pure spices. Real origin. No middlemen.
            </p>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,248,240,0.6)' }}>
              Sourced directly from Kerala &amp; Tamil Nadu farms.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="label-tag mb-4" style={{ color: 'rgba(255,248,240,0.4)' }}>Shop</p>
              {['Spices', 'Nuts', 'Seeds', 'Millets', 'Dry Fruits'].map((item) => (
                <Link key={item} href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-sm mb-2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,248,240,0.7)' }}>
                  {item}
                </Link>
              ))}
            </div>
            <div>
              <p className="label-tag mb-4" style={{ color: 'rgba(255,248,240,0.4)' }}>Company</p>
              {[['Our Story', '/story'], ['Origin', '/origin'], ['Contact', '/contact']].map(([label, href]) => (
                <Link key={label} href={href}
                  className="block text-sm mb-2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,248,240,0.7)' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '0.5px solid rgba(255,248,240,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>
            © 2024 SpiNuts by Amigoz. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>
            spinuts.store
          </p>
        </div>
      </div>
    </footer>
  );
}
