'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function HiringRolesList() {
  const roles = useAppStore((s) => s.roles);
  const display = roles.slice(0, 4);
  const showFade = roles.length >= 4;

  return (
    <div>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#1a1612',
        }}>Hiring Roles</h3>
        <Link href="/roles" style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: 11,
          color: '#8b6914',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>View all →</Link>
      </div>

      {/* List */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  cursor: 'pointer',
                  animation: `fsu .2s ease ${i * 0.04}s both`,
                }}
              >
                <Briefcase size={14} style={{ color: '#8b6914', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 12,
                    color: '#1a1612',
                    fontWeight: 600,
                  }}>{role.title}</div>
                  <div style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 10,
                    color: '#9a9184',
                  }}>{role.dept}</div>
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  padding: '3px 8px',
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
