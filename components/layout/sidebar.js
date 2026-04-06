'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Bell,
  ChevronDown, Search, Check, Plus, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
};

const EXPANDED_WIDTH = 210;
const COLLAPSED_WIDTH = 56;

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [wsOpen, setWsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

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
        backgroundColor: '#fff',
        borderRight: '1px solid #e8e5e0',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Workspace Switcher + Collapse ── */}
      <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '20px 0' : '20px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10,
            borderBottom: '1px solid #e8e5e0',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => { if (!collapsed) setWsOpen(!wsOpen); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: collapsed ? 'default' : 'pointer',
              flex: collapsed ? undefined : 1,
              minWidth: 0,
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
          </div>

          {/* Collapse button — only when expanded */}
          {!collapsed && (
            <button
              onClick={toggleSidebar}
              title="Collapse sidebar"
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--brown-soft)',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <PanelLeftClose size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Collapsed: expand button below logo */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <button
              onClick={toggleSidebar}
              title="Expand sidebar"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--brown-soft)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <PanelLeftOpen size={14} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Dropdown */}
        {wsOpen && !collapsed && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 8,
              right: 8,
              zIndex: 50,
              backgroundColor: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-dropdown)',
              padding: 6,
              marginTop: 4,
              animation: 'fsd .15s ease',
            }}
          >
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
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)',
                backgroundColor: '#f5f3ee', padding: '1px 5px', borderRadius: 4,
              }}>Esc</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px',
              borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.02)',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--brown)' }}>NeoHuman</span>
              <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            </div>
            <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '6px 0' }} />
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 8px',
                border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px dashed var(--border-hover)',
              }}>
                <Plus size={11} style={{ color: 'var(--brown-soft)' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--brown)' }}>Create Team</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)', marginTop: 1 }}>Collaborate with others</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ── Global Search ── */}
      {!collapsed && (
        <div style={{ padding: '10px 16px 6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
            borderRadius: 8, border: '1px solid var(--border-light)', backgroundColor: 'var(--cream)', cursor: 'pointer',
          }}>
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
          <div style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-light)',
            backgroundColor: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
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
                borderRadius: 0,
                borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
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

        {[
          { label: 'Help & Support', Icon: HelpCircle },
          { label: 'Notifications', Icon: Bell, badge: true },
        ].map(({ label, Icon, badge }) => (
          <button
            key={label}
            title={collapsed ? label : undefined}
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
            <Icon size={15} strokeWidth={1.5} />
            {!collapsed && <span>{label}</span>}
            {badge && (
              <span style={{
                position: 'absolute',
                top: collapsed ? 6 : 5,
                left: collapsed ? 'calc(50% + 6px)' : 22,
                width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--red)',
              }} />
            )}
          </button>
        ))}

        {/* User info (Clerk) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: collapsed ? '8px 0' : '10px 8px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          marginTop: 4, borderTop: '1px solid #e8e5e0', paddingTop: 12,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 700,
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
              <div style={{ fontSize: 10, fontFamily: 'var(--font-body)', color: 'var(--brown-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
