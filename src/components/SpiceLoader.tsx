'use client';

export function SpiceLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const seeds = ['🌶️', '🥜', '🌿'];
  const px = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-base';

  return (
    <span className={`inline-flex items-center gap-1 ${px}`}>
      {seeds.map((s, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: `spiceBounce 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {s}
        </span>
      ))}
      <style>{`
        @keyframes spiceBounce {
          0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          40%            { transform: translateY(-6px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export function AddingToCart() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          border: '1.5px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spiceSpin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spiceSpin { to { transform: rotate(360deg); } }`}</style>
      Adding
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="flex items-end gap-2">
        {['🌶️', '🥜', '🌿', '🌾', '🍇'].map((s, i) => (
          <span
            key={i}
            className="text-2xl inline-block"
            style={{
              animation: 'spiceWave 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <p className="label-tag" style={{ color: '#1B4332' }}>Loading fresh from the Ghats...</p>
      <style>{`
        @keyframes spiceWave {
          0%, 100% { transform: translateY(0);   opacity: 0.4; }
          50%       { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
