'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Bell, Sun, Moon,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
};

const EXPANDED_WIDTH = 200;
const COLLAPSED_WIDTH = 60;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [hovered, setHovered] = useState(false);
  const [theme, setTheme] = useState('light');

  const expanded = hovered;
  const sidebarWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const userName = user?.firstName || user?.username || 'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: sidebarWidth,
        height: '100vh',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--cream-sidebar)',
        borderRight: '1px solid var(--border-light)',
        transition: 'width .25s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo Area ── */}
      <div
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: expanded ? '16px 16px' : '16px 0',
          justifyContent: expanded ? 'flex-start' : 'center',
          borderBottom: '1px solid var(--border-light)',
          cursor: 'pointer',
          transition: 'padding .25s cubic-bezier(.4,0,.2,1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8b6914, #c4a332)',
            flexShrink: 0,
          }}
        >
          <span style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>J</span>
        </div>
        {expanded && (
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--brown)',
            whiteSpace: 'nowrap',
          }}>
            Jack-Co
          </span>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav style={{
        flex: 1,
        padding: expanded ? '12px 8px' : '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        transition: 'padding .25s cubic-bezier(.4,0,.2,1)',
      }}>
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              title={!expanded ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: expanded ? '10px 16px' : '10px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                margin: expanded ? '0 8px' : '0',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 12,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontWeight: 400,
                color: isActive ? '#1a1612' : '#9a9184',
                backgroundColor: isActive ? '#f0ebe2' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#faf6ef';
                  e.currentTarget.style.color = '#1a1612';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9a9184';
                }
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{
                  flexShrink: 0,
                  color: isActive ? '#8b6914' : '#c4b896',
                  transition: 'color 0.15s ease',
                }}
              />
              {expanded && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div style={{
        padding: expanded ? '10px 16px 14px' : '10px 0 14px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'padding .25s cubic-bezier(.4,0,.2,1)',
        flexShrink: 0,
      }}>
        {/* Plan */}
        {expanded && (
          <div style={{
            padding: '4px 8px 8px',
            fontSize: 9,
            fontFamily: "'DM Mono', monospace",
            color: '#c4b896',
            fontWeight: 500,
          }}>
            Plan: FREE
          </div>
        )}

        {/* Settings */}
        <Link
          href="/settings"
          title={!expanded ? 'Settings' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: expanded ? '8px 8px' : '8px 0',
            justifyContent: expanded ? 'flex-start' : 'center',
            margin: expanded ? '0 8px' : '0',
            borderRadius: 8, textDecoration: 'none', fontSize: 12,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            color: '#9a9184', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#faf6ef';
            e.currentTarget.style.color = '#1a1612';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#9a9184';
          }}
        >
          <Settings size={20} strokeWidth={1.5} style={{ color: '#c4b896', flexShrink: 0 }} />
          {expanded && <span>Settings</span>}
        </Link>

        {/* Help & Support (non-interactive) */}
        <div
          title={!expanded ? 'Help & Support' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: expanded ? '8px 8px' : '8px 0',
            justifyContent: expanded ? 'flex-start' : 'center',
            margin: expanded ? '0 8px' : '0',
            borderRadius: 8, fontSize: 12,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            color: '#9a9184', cursor: 'default',
          }}
        >
          <HelpCircle size={20} strokeWidth={1.5} style={{ color: '#c4b896', flexShrink: 0 }} />
          {expanded && <span>Help & Support</span>}
        </div>

        {/* Notifications (non-interactive, with red dot) */}
        <div
          title={!expanded ? 'Notifications' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: expanded ? '8px 8px' : '8px 0',
            justifyContent: expanded ? 'flex-start' : 'center',
            margin: expanded ? '0 8px' : '0',
            borderRadius: 8, fontSize: 12,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            color: '#9a9184', cursor: 'default',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Bell size={20} strokeWidth={1.5} style={{ color: '#c4b896' }} />
            <span style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: 'var(--red)',
            }} />
          </div>
          {expanded && <span>Notifications</span>}
        </div>

        {/* User info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: expanded ? '8px 8px' : '8px 0',
          justifyContent: expanded ? 'flex-start' : 'center',
          marginTop: 4,
          cursor: 'default',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            background: 'linear-gradient(135deg, #8b6914, #c4a332)',
            color: '#fff', flexShrink: 0,
          }}>
            {userInitial}
          </div>
          {expanded && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
                color: '#9a9184',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {userEmail || 'user@email.com'}
              </div>
            </div>
          )}
        </div>

        {/* Light/Dark toggle */}
        {expanded && (
          <div style={{
            display: 'flex', borderRadius: 8, padding: 2, marginTop: 4,
            backgroundColor: 'var(--cream-row-even)',
          }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '5px 0', borderRadius: 6, fontSize: 11,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                backgroundColor: theme === 'light' ? 'var(--cream-card)' : 'transparent',
                color: theme === 'light' ? 'var(--brown)' : 'var(--brown-light)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <Sun size={11} /> Light
            </button>
            <button
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '5px 0', borderRadius: 6, fontSize: 11,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                backgroundColor: 'transparent',
                color: 'var(--brown-light)',
                border: 'none', cursor: 'not-allowed', transition: 'all 0.2s ease',
                opacity: 0.5,
              }}
            >
              <Moon size={11} /> Dark
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export { EXPANDED_WIDTH, COLLAPSED_WIDTH };
