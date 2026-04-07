'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function HiringRolesList() {
  const roles = useAppStore((s) => s.roles);
  const display = roles.slice(0, 4);
  const showFade = roles.length > 4;

  if (roles.length === 0) return null;

  return (
    <div>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--brown)',
        }}>Hiring Roles</h3>
        <Link href="/roles" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--gold)',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>View all →</Link>
      </div>

      {/* List */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {display.map((role, i) => {
            const statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            const statusColor = `var(--${statusInfo.color})`;
            return (
              <div
                key={role.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  cursor: 'pointer',
                  animation: `fsu .2s ease ${i * 0.04}s both`,
                }}
              >
                <Briefcase size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown)',
                    fontWeight: 600,
                  }}>{role.title}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    color: 'var(--brown-soft)',
                  }}>{role.dept}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  padding: '4px 12px',
                  borderRadius: 12,
                  backgroundColor: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
                  color: statusColor,
                }}>{statusInfo.label}</span>
              </div>
            );
          })}
        </div>

        {/* Fade overlay */}
        {showFade && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            background: 'linear-gradient(transparent, var(--cream))',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}
