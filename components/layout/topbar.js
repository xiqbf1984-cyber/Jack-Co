'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToggleBar from './toggle-bar';

export default function Topbar({ tab, onTabChange }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
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
        padding: '0 32px',
        height: 56,
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: scrolled ? 'rgba(251, 249, 244, 0.85)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : undefined,
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Left - Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
          <span style={{ color: 'var(--brown)' }}>Neo</span><span style={{ color: 'var(--gold)' }}>Human</span>
        </span>
      </Link>

      {/* Center - Toggle */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <ToggleBar
          options={['Hiring Human', 'Hiring AI']}
          value={tab}
          onChange={onTabChange}
        />
      </div>

      {/* Right - Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/login" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', textDecoration: 'none' }}>
          Log in
        </Link>
        <Link href="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
          Get Started
        </Link>
      </div>
    </header>
  );
}
