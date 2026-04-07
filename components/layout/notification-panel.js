'use client';

import { useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import { X, Bell, Trophy, UserPlus, Briefcase, CheckCheck } from 'lucide-react';

const TYPE_ICONS = {
  assessment: Trophy,
  candidate: UserPlus,
  role: Briefcase,
};

const TYPE_COLORS = {
  assessment: 'var(--accent-green)',
  candidate: 'var(--gold)',
  role: 'var(--brown)',
};

function formatTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  return days + 'd ago';
}

export default function NotificationPanel({ open, onClose }) {
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: sidebarWidth + 8,
        bottom: 60,
        width: 360,
        maxHeight: 480,
        transition: 'left 0.2s ease',
        backgroundColor: '#fff',
        borderRadius: 14,
        boxShadow: 'var(--shadow-modal)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeScale .15s ease both',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={15} style={{ color: 'var(--brown)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#fff',
              backgroundColor: 'var(--red)', padding: '1px 6px', borderRadius: 8,
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4,
              color: 'var(--brown-soft)',
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '32px 16px', textAlign: 'center',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
          }}>
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || Bell;
            const iconColor = TYPE_COLORS[n.type] || 'var(--brown)';
            return (
              <div
                key={n.id}
                onClick={() => { if (!n.read) markNotificationRead(n.id); }}
                style={{
                  display: 'flex', gap: 12, padding: '12px 16px',
                  borderBottom: '1px solid var(--border-light)',
                  backgroundColor: n.read ? 'transparent' : 'rgba(139,105,20,0.03)',
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => { if (!n.read) e.currentTarget.style.backgroundColor = 'rgba(139,105,20,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(139,105,20,0.03)'; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  backgroundColor: iconColor + '14',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} style={{ color: iconColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: n.read ? 400 : 600,
                    color: 'var(--brown)', lineHeight: 1.3,
                  }}>
                    {n.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 11,
                    color: 'var(--brown-soft)', marginTop: 2, lineHeight: 1.4,
                  }}>
                    {n.message}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'var(--brown-light)', marginTop: 4,
                  }}>
                    {formatTime(n.timestamp)}
                  </div>
                </div>
                {!n.read && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: 'var(--gold)', flexShrink: 0, marginTop: 4,
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
