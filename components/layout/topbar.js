'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ToggleBar from './toggle-bar';

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
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-6 h-14',
        'border-b border-[var(--border-light)]',
        scrolled
          ? 'liquid-glass shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          : 'bg-[var(--cream)]'
      )}
    >
      {/* Left - Logo */}
      <Link href="/" className="font-display text-lg font-bold text-[var(--brown)] no-underline">
        WorkTrial
      </Link>

      {/* Center - Toggle */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <ToggleBar options={['For Candidates', 'For Companies']} />
      </div>

      {/* Right - Auth buttons */}
      <div className="flex items-center gap-3">
        <button
          className="text-body-sm font-semibold text-[var(--brown)] bg-transparent border-none cursor-pointer hover:text-[var(--brown-muted)] transition-colors"
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
