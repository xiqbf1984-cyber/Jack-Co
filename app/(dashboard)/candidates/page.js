'use client';

import { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

const GRID_COLUMNS = '2fr 1fr 1fr 0.7fr';

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
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1612',
        }}>Candidates</h1>
        <button onClick={openModal} className="btn-primary" style={{ padding: '7px 16px' }}>
          + Add Candidate
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 280, marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9184' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          style={{
            width: '100%',
            paddingLeft: 34,
            paddingRight: 12,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 8,
            border: '1px solid var(--border-default)',
            background: '#fff',
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 12,
            color: '#1a1612',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid var(--border-default)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            {['CANDIDATE', 'STATUS', 'TIMEZONE', 'EMAIL'].map((h) => (
              <span key={h} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: 500,
                color: '#9a9184',
                textTransform: 'uppercase',
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((cand, i) => {
            const statusInfo = STATUS_MAP[cand.status] || STATUS_MAP.idle;
            const statusColor = `var(--${statusInfo.color})`;
            const initials = cand.avatar || cand.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

            return (
              <div
                key={cand.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: GRID_COLUMNS,
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                  alignItems: 'center',
                  animation: `fsu .2s ease ${i * 0.04}s both`,
                }}
              >
                {/* Candidate */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
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
                  <span style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 12,
                    color: '#1a1612',
                    fontWeight: 600,
                  }}>{cand.name}</span>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: statusColor,
                  }} />
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: statusColor,
                  }}>{statusInfo.label}</span>
                </div>

                {/* Timezone */}
                <span style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: 11,
                  color: '#1a1612',
                }}>{cand.tz}</span>

                {/* Email */}
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: '#9a9184',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{cand.email}</span>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-light)',
          }}>
            <span style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 11,
              color: '#c4b896',
            }}>Viewing {filtered.length} rows</span>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Users size={32} style={{ color: '#c4b896', marginBottom: 12 }} />
          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: '#9a9184' }}>
            {search ? 'No candidates match your search' : 'No candidates yet'}
          </p>
        </div>
      )}
    </div>
  );
}
