'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Bell, Sun, Moon
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 200,
        height: '100vh',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--cream-sidebar)',
        borderRight: '1px solid var(--border-light)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px',
          height: 56,
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
        }}
      >
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'var(--btn-text)', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)' }}>N</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--brown)' }}>
            NeoHuman
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <span className="text-mono-label" style={{ padding: '0 12px', marginBottom: 4 }}>
          Navigation
        </span>
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--gold)' : 'var(--brown)',
                backgroundColor: isActive ? 'rgba(139,105,20,0.06)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Plan */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px' }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)' }}>Plan</span>
          <span className="text-mono-tag" style={{ color: 'var(--accent-green)' }}>FREE</span>
        </div>

        {/* Preferences label */}
        <span className="text-mono-label" style={{ padding: '8px 12px 4px', marginTop: 4 }}>
          Preferences
        </span>

        {/* Settings */}
        <Link
          href="/settings"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 8, textDecoration: 'none', fontSize: 13,
            fontFamily: 'var(--font-body)', color: 'var(--brown)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Settings size={16} strokeWidth={1.5} />
          <span>Settings</span>
        </Link>

        {/* Help */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)',
            color: 'var(--brown)', background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <HelpCircle size={16} strokeWidth={1.5} />
          <span>Help & Support</span>
        </button>

        {/* Notifications */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)',
            color: 'var(--brown)', background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Bell size={16} strokeWidth={1.5} />
          <span>Notifications</span>
          <span style={{ position: 'absolute', top: 6, left: 24, width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--red)' }} />
        </button>

        {/* Light/Dark toggle */}
        <div style={{ display: 'flex', borderRadius: 8, padding: 2, marginTop: 4, backgroundColor: 'var(--cream-row-even)' }}>
          <button style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '5px 0', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--cream-card)', color: 'var(--brown)', border: 'none', cursor: 'default',
          }}>
            <Sun size={11} /> Light
          </button>
          <button style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '5px 0', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-body)',
            backgroundColor: 'transparent', color: 'var(--brown-light)', border: 'none', cursor: 'default',
          }}>
            <Moon size={11} /> Dark
          </button>
        </div>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', marginTop: 4, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
            background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
            color: 'var(--brown)', flexShrink: 0,
          }}>
            K
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kolento Hou</div>
            <div style={{ fontSize: 9, color: 'var(--brown-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>th2902@nyu.edu</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
