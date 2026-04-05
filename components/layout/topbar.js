'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 border-b"
      style={{
        height: 56,
        borderColor: 'var(--border-light)',
        backgroundColor: scrolled ? 'rgba(251, 249, 244, 0.85)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : undefined,
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
      }}
    >
      {/* Left - Logo icon */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
          }}
        >
          <Briefcase size={14} style={{ color: 'var(--btn-text)' }} />
        </div>
      </Link>

      {/* Right - Auth buttons */}
      <div className="flex items-center gap-3">
        <button
          className="text-body-sm font-semibold bg-transparent border-none cursor-pointer transition-colors"
          style={{ color: 'var(--brown)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brown-muted)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--brown)'; }}
        >
          Log in
        </button>
        <button className="btn-primary">
          Sign up
        </button>
      </div>
    </header>
  );
}
