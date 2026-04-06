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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#1a1612',
        }}>Recent Candidates</h3>
        <Link href="/candidates" style={{
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
                  padding: '12px 14px',
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
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    color: '#8b6914',
                  }}>{initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 12,
                    color: '#1a1612',
                    fontWeight: 600,
                  }}>{cand.name}</div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: '#c4b896',
                  }}>{cand.email}</div>
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
