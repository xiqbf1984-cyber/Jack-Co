'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToggleBar from './toggle-bar';

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('For Candidates');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-8 border-b"
      style={{
        height: 56,
        borderColor: 'var(--border-light)',
        backgroundColor: scrolled ? 'rgba(251, 249, 244, 0.85)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : undefined,
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Left - Logo */}
      <Link
        href="/"
        className="no-underline font-display"
        style={{ fontSize: 18, fontWeight: 600, color: 'var(--brown)', letterSpacing: '-0.3px' }}
      >
        NeoHuman
      </Link>

      {/* Center - Toggle */}
      <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
        <ToggleBar
          options={['For Candidates', 'For Companies']}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Right - Auth */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-body-sm font-semibold no-underline"
          style={{ color: 'var(--brown)' }}
        >
          Log in
        </Link>
        <Link href="/signup" className="btn-primary no-underline" style={{ padding: '7px 18px' }}>
          Sign up
        </Link>
      </div>
    </header>
  );
}
