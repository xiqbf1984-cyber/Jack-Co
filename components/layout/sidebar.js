'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Bell, Sun, Moon,
  ChevronDown, Search, Check, Plus, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
};

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 64;

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [wsOpen, setWsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const dropdownRef = useRef(null);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setWsOpen(false);
      }
    }
    if (wsOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [wsOpen]);

  const userName = user?.firstName || user?.username || 'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
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
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Collapse toggle — top-right */}
      <button
        onClick={toggleSidebar}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          top: 14,
          right: collapsed ? undefined : 8,
          left: collapsed ? '50%' : undefined,
          transform: collapsed ? 'translateX(-50%)' : undefined,
          width: 28,
          height: 28,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
          color: 'var(--brown-soft)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {collapsed ? <PanelLeftOpen size={15} strokeWidth={1.5} /> : <PanelLeftClose size={15} strokeWidth={1.5} />}
      </button>
      {/* ── Workspace Switcher ── */}
      <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => { if (!collapsed) setWsOpen(!wsOpen); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: collapsed ? '14px 0' : '14px 40px 14px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none',
            borderBottom: '1px solid var(--border-light)',
            background: 'transparent',
            cursor: collapsed ? 'default' : 'pointer',
            textAlign: 'left',
            transition: 'padding 0.2s ease',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'var(--btn-text)', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)' }}>N</span>
          </div>
          {!collapsed && (
            <>
              <span style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                color: 'var(--brown)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                NeoHuman
              </span>
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--brown-soft)',
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: wsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </>
          )}
        </button>

        {/* Dropdown */}
        {wsOpen && !collapsed && (
          <div
            className="animate-fsd"
            style={{
              position: 'absolute',
              top: '100%',
              left: 8,
              right: 8,
              zIndex: 50,
              backgroundColor: 'var(--cream-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-dropdown)',
              padding: 6,
              marginTop: 4,
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <input
                type="text"
                placeholder="Find Team..."
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  border: '1px solid var(--border-light)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brown)',
                  backgroundColor: 'var(--cream)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'var(--brown-soft)',
                backgroundColor: 'var(--cream-sidebar)',
                padding: '1px 5px',
                borderRadius: 4,
              }}>
                Esc
              </span>
            </div>

            {/* Current org */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 8px',
                borderRadius: 6,
                backgroundColor: 'rgba(0,0,0,0.02)',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--brown)' }}>
                NeoHuman
              </span>
              <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '6px 0' }} />

            {/* Create Team */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 8px',
                border: 'none',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px dashed var(--border-hover)',
              }}>
                <Plus size={11} style={{ color: 'var(--brown-soft)' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--brown)' }}>Create Team</div>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)', marginTop: 1 }}>Collaborate with others in a shared workspace</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ── Global Search ── */}
      {!collapsed && (
        <div style={{ padding: '10px 12px 6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 8,
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--cream)',
              cursor: 'pointer',
            }}
          >
            <Search size={13} style={{ color: 'var(--brown-soft)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)' }}>Search</span>
            <span style={{
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              color: 'var(--brown-soft)',
              backgroundColor: 'var(--cream-sidebar)',
              padding: '1px 5px',
              borderRadius: 4,
              border: '1px solid var(--border-light)',
            }}>
              ⌘K
            </span>
          </div>
        </div>
      )}

      {collapsed && (
        <div style={{ padding: '10px 0 6px', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Search size={14} style={{ color: 'var(--brown-soft)' }} />
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav style={{
        flex: 1,
        padding: collapsed ? '8px 8px' : '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        transition: 'padding 0.2s ease',
      }}>
        {!collapsed && (
          <span className="text-mono-label" style={{ padding: '4px 10px 6px' }}>
            Navigation
          </span>
        )}
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '9px 0' : '8px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
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
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div style={{
        padding: collapsed ? '8px 8px 10px' : '8px 10px 10px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'padding 0.2s ease',
      }}>
        {!collapsed && (
          <span className="text-mono-label" style={{ padding: '4px 10px 6px' }}>
            Preferences
          </span>
        )}

        {/* Settings */}
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '8px 0' : '7px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8, textDecoration: 'none', fontSize: 12,
            fontFamily: 'var(--font-body)', color: 'var(--brown)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Settings size={15} strokeWidth={1.5} />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Help */}
        <button
          title={collapsed ? 'Help & Support' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '8px 0' : '7px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-body)',
            color: 'var(--brown)', background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <HelpCircle size={15} strokeWidth={1.5} />
          {!collapsed && <span>Help & Support</span>}
        </button>

        {/* Notifications */}
        <button
          title={collapsed ? 'Notifications' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '8px 0' : '7px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-body)',
            color: 'var(--brown)', background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Bell size={15} strokeWidth={1.5} />
          {!collapsed && <span>Notifications</span>}
          <span style={{
            position: 'absolute',
            top: collapsed ? 6 : 5,
            left: collapsed ? 'calc(50% + 6px)' : 22,
            width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--red)',
          }} />
        </button>

        {/* Light/Dark toggle */}
        {!collapsed && (
          <div style={{ display: 'flex', borderRadius: 8, padding: 2, marginTop: 4, backgroundColor: 'var(--cream-row-even)' }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '5px 0', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-body)',
                backgroundColor: theme === 'light' ? 'var(--cream-card)' : 'transparent',
                color: theme === 'light' ? 'var(--brown)' : 'var(--brown-light)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <Sun size={11} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '5px 0', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-body)',
                backgroundColor: theme === 'dark' ? 'var(--cream-card)' : 'transparent',
                color: theme === 'dark' ? 'var(--brown)' : 'var(--brown-light)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <Moon size={11} /> Dark
            </button>
          </div>
        )}

        {/* User info (Clerk) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: collapsed ? '8px 0' : '8px 8px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          marginTop: 4,
          borderRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.02)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
            background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
            color: 'var(--brown)', flexShrink: 0,
          }}>
            {userInitial}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </div>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export { EXPANDED_WIDTH, COLLAPSED_WIDTH };
