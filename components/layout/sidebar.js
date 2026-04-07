'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  Home, Briefcase, ClipboardList, Users, BarChart3,
  Settings, HelpCircle, Bell, Search, LogOut, ChevronLeft, ChevronRight, User,
} from 'lucide-react';

const iconMap = {
  Home, Briefcase, ClipboardList, Users, BarChart3,
};

const EXPANDED_WIDTH = 210;
const COLLAPSED_WIDTH = 56;

export default function Sidebar({ onOpenCommandPalette, onOpenNotifications, onOpenHelp }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const notifications = useAppStore((s) => s.notifications);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [edgeHover, setEdgeHover] = useState(false);
  const userMenuRef = useRef(null);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // Keyboard shortcut for sidebar toggle
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const userName = user?.firstName || user?.username || 'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userInitial = userName.charAt(0).toUpperCase();
  const userAvatar = user?.imageUrl || null;

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
        backgroundColor: '#fff',
        borderRight: '1px solid #e8e5e0',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo / Home ── */}
      <div style={{ flexShrink: 0 }}>
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '20px 0' : '20px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 0,
            borderBottom: '1px solid #e8e5e0',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          {collapsed ? (
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>N</span>
          ) : (
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
              <span style={{ color: 'var(--brown)' }}>Neo</span>
              <span style={{ color: 'var(--gold)' }}>Human</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Global Search ── */}
      {!collapsed && (
        <div style={{ padding: '10px 16px 6px' }}>
          <div
            onClick={() => onOpenCommandPalette?.()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
              borderRadius: 8, border: '1px solid var(--border-light)', backgroundColor: 'var(--cream)', cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
          >
            <Search size={13} style={{ color: 'var(--brown-soft)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)' }}>Search</span>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)',
              backgroundColor: '#f5f3ee', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border-light)',
            }}>⌘K</span>
          </div>
        </div>
      )}

      {collapsed && (
        <div style={{ padding: '10px 0 6px', display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={() => onOpenCommandPalette?.()}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-light)',
              backgroundColor: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
          >
            <Search size={14} style={{ color: 'var(--brown-soft)' }} />
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav style={{
        flex: 1,
        padding: collapsed ? '8px 6px' : '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        transition: 'padding 0.2s ease',
      }}>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--brown-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 0 8px',
          }}>
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
                color: isActive ? 'var(--brown)' : 'var(--brown-soft)',
                backgroundColor: isActive ? 'var(--cream)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.025)';
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
        padding: collapsed ? '8px 6px 10px' : '8px 16px 10px',
        borderTop: '1px solid #e8e5e0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'padding 0.2s ease',
      }}>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--brown-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 0 8px',
          }}>
            Preferences
          </span>
        )}

        {[
          { href: '/settings', label: 'Settings', Icon: Settings },
        ].map(({ href, label, Icon }) => (
          <Link
            key={label}
            href={href}
            title={collapsed ? label : undefined}
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
            <Icon size={15} strokeWidth={1.5} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}

        {/* Help & Support */}
        <button
          title={collapsed ? 'Help & Support' : undefined}
          onClick={() => onOpenHelp?.()}
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
          onClick={() => onOpenNotifications?.()}
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
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: collapsed ? 6 : 5,
              left: collapsed ? 'calc(50% + 6px)' : 22,
              minWidth: 14, height: 14, borderRadius: 7,
              backgroundColor: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 700, color: '#fff',
              padding: '0 3px',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User info (Clerk) with popover */}
        <div ref={userMenuRef} style={{ position: 'relative', marginTop: 4, borderTop: '1px solid #e8e5e0', paddingTop: 12 }}>
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: collapsed ? '8px 0' : '8px 8px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                color: 'var(--brown)', flexShrink: 0,
              }}>
                {userInitial}
              </div>
            )}
            {!collapsed && (
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userName}
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userEmail}
                </div>
              </div>
            )}
          </div>

          {/* User popover menu */}
          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: collapsed ? -4 : 0,
              right: collapsed ? undefined : 0,
              width: collapsed ? 180 : undefined,
              marginBottom: 6,
              backgroundColor: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-dropdown)',
              overflow: 'hidden',
              animation: 'fsu .12s ease both',
              zIndex: 50,
            }}>
              <button
                onClick={() => { openUserProfile(); setUserMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px',
                  border: 'none', background: 'transparent', fontFamily: 'var(--font-body)',
                  fontSize: 12, color: 'var(--brown)', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <User size={13} />
                Manage Account
              </button>
              <div style={{ height: 1, backgroundColor: 'var(--border-light)' }} />
              <button
                onClick={() => { signOut(); setUserMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px',
                  border: 'none', background: 'transparent', fontFamily: 'var(--font-body)',
                  fontSize: 12, color: 'var(--red)', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Edge collapse handle ── */}
      <div
        onMouseEnter={() => setEdgeHover(true)}
        onMouseLeave={() => setEdgeHover(false)}
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          right: -12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          opacity: edgeHover ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{
          width: 20,
          height: 28,
          borderRadius: 6,
          backgroundColor: '#fff',
          border: '1px solid var(--border-default)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {collapsed ? (
            <ChevronRight size={12} style={{ color: 'var(--brown-soft)' }} />
          ) : (
            <ChevronLeft size={12} style={{ color: 'var(--brown-soft)' }} />
          )}
        </div>
      </div>
    </aside>
  );
}

export { EXPANDED_WIDTH, COLLAPSED_WIDTH };
