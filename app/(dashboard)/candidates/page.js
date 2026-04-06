'use client';

import { useState, useMemo } from 'react';
import { Search, Users, Filter, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

export default function CandidatesPage() {
  const candidates = useAppStore((s) => s.candidates);
  const openModal = useAppStore((s) => s.openAddCandidateModal);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return candidates;
    const q = search.toLowerCase();
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [candidates, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--brown)',
          }}>Candidates</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            marginTop: 4,
          }}>Manage your candidate pool and track their progress</p>
        </div>
        <button onClick={openModal} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
          + Add Candidate
        </button>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 14px',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-soft)',
          cursor: 'pointer',
        }}>
          <Filter size={13} />
          Status
        </button>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '35% 15% 15% 15% 15% 5%',
            padding: '0 16px',
            height: 40,
            alignItems: 'center',
            borderBottom: '1px solid var(--border-default)',
          }}>
            {['CANDIDATE', 'STATUS', 'TIMEZONE', 'TRIALS', 'LAST ACTIVE', ''].map((h) => (
              <span key={h || 'actions'} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--brown-soft)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>{h}</span>
            ))}
          </div>

          {/* Data rows */}
          {filtered.map((cand, i) => {
            const statusInfo = STATUS_MAP[cand.status] || STATUS_MAP.idle;
            const statusColor = `var(--${statusInfo.color})`;
            const initials = cand.avatar || cand.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
            const bgColor = avatarColors[i % avatarColors.length];

            return (
              <div
                key={cand.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '35% 15% 15% 15% 15% 5%',
                  padding: '0 16px',
                  height: 64,
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.015)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Candidate */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#fff',
                    }}>{initials}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--brown)',
                    }}>{cand.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--brown-light)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{cand.email}</div>
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: statusColor,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown)',
                  }}>{statusInfo.label}</span>
                </div>

                {/* Timezone */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                }}>{cand.tz}</span>

                {/* Trials */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                }}>{cand.trials}</span>

                {/* Last Active */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown-soft)',
                }}>{cand.lastActive}</span>

                {/* Actions */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: 'var(--brown-light)',
                }}>
                  <MoreHorizontal size={16} />
                </button>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ padding: '12px 16px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown-light)',
            }}>Viewing {filtered.length} rows</span>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Users size={32} style={{ color: 'var(--brown-light)', marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            {search ? 'No candidates match your search' : 'No candidates yet'}
          </p>
        </div>
      )}
    </div>
  );
}
