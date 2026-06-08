'use client';

export function SpiceLoader() {
  const emojis = ['🌶️', '🥜', '🌿'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {emojis.map((e, i) => (
        <span key={i} style={{
          fontSize: '1.4rem',
          display: 'inline-block',
          animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
        }}>{e}</span>
      ))}
    </div>
  );
}

export function AddingToCart() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 12, height: 12, borderRadius: '50%',
        border: '2px solid rgba(253,246,238,0.3)',
        borderTopColor: '#FDF6EE',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }} />
    </span>
  );
}

export function PageLoader() {
  const emojis = ['🌶️', '🥜', '🌿', '🌾', '🍇'];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 0', gap: 20,
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {emojis.map((e, i) => (
          <span key={i} style={{
            fontSize: '1.8rem',
            display: 'inline-block',
            animation: `wave 1.4s ease-in-out ${i * 0.12}s infinite`,
          }}>{e}</span>
        ))}
      </div>
      <p className="tag" style={{ color: '#C4783A', letterSpacing: '0.15em', fontSize: '0.6rem' }}>
        Loading fresh from the Ghats...
      </p>
    </div>
  );
}
