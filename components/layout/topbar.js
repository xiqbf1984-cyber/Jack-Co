'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToggleBar from './toggle-bar';

export default function Topbar({ tab, onTabChange }) {
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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 24,
        paddingRight: 24,
        height: 56,
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: scrolled ? 'rgba(251, 249, 244, 0.85)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : undefined,
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
      }}
    >
      {/* Left - Logo text */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
          }}
        >
          <span style={{ color: 'var(--btn-text)', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>N</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--brown)' }}>
          NeoHuman
        </span>
      </Link>

      {/* Center - Toggle bar */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <ToggleBar
          options={['For Candidates', 'For Companies']}
          value={tab}
          onChange={onTabChange}
        />
      </div>

      {/* Right - Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/login"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brown)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Log in
        </Link>
        <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
          Sign up
        </Link>
      </div>
    </header>
  );
}
