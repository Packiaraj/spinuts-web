'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  url: string;
  title: string;
  subtitle: string;
}

export default function PromoVideo({ url, title, subtitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Detect if it's a YouTube URL
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  function getEmbedUrl(raw: string) {
    if (raw.includes('youtube.com/watch')) {
      const id = new URL(raw).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0`;
    }
    if (raw.includes('youtu.be/')) {
      const id = raw.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0`;
    }
    if (raw.includes('vimeo.com/')) {
      const id = raw.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
    }
    return raw;
  }

  return (
    <section style={{ backgroundColor: '#1C0F04', overflow: 'hidden' }} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          style={{
            textAlign: 'center', marginBottom: 40,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="tag mb-3" style={{ color: '#B8860B', letterSpacing: '0.18em' }}>Behind the scenes</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            color: '#FDF6EE',
            marginBottom: 12,
          }}>
            {title}
          </h2>
          <p style={{ color: 'rgba(253,246,238,0.55)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Video */}
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            border: '1px solid rgba(184,134,11,0.2)',
            position: 'relative',
            aspectRatio: '16/9',
            backgroundColor: '#0a0603',
          }}
        >
          {isYoutube || isVimeo ? (
            <iframe
              src={getEmbedUrl(url)}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }}
            />
          ) : (
            <video
              src={url}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
          )}

          {/* Gold corner accent */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(184,134,11,0.08) 0%, transparent 40%, transparent 60%, rgba(184,134,11,0.04) 100%)',
          }} />
        </div>

        {/* Bottom tags */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {['Sourced from Indian Farms', 'Hand Cleaned & Packed', 'No Preservatives', 'Farm to Kitchen'].map((tag) => (
            <div key={tag} className="flex items-center gap-2">
              <span style={{ color: '#B8860B', fontSize: '0.55rem' }}>✦</span>
              <span className="tag" style={{ color: 'rgba(253,246,238,0.45)', fontSize: '0.6rem' }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
