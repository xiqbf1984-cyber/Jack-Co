'use client';

import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function RecentCandidatesList() {
  const candidates = useAppStore((s) => s.candidates);
  const display = candidates.slice(0, 4);
  const showFade = candidates.length >= 4;

  return (
    <div>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--brown)',
        }}>Recent Candidates</h3>
        <Link href="/candidates" style={{
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
          {display.map((cand, i) => {
            const statusInfo = STATUS_MAP[cand.status] || STATUS_MAP.idle;
            const statusColor = `var(--${statusInfo.color})`;
            const initials = cand.avatar || cand.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
            return (
              <div
                key={cand.id}
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
                {/* Avatar */}
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, rgba(139,105,20,0.13), rgba(196,163,50,0.13))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 8,
                    fontWeight: 700,
                    color: 'var(--gold)',
                  }}>{initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown)',
                    fontWeight: 600,
                  }}>{cand.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 9,
                    color: 'var(--brown-light)',
                  }}>{cand.email}</div>
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
