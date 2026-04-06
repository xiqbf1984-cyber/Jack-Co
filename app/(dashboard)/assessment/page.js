'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Trophy } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function ChallengesPage() {
  const challenges = useAppStore((s) => s.challenges);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return challenges;
    const q = search.toLowerCase();
    return challenges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.roleTitle?.toLowerCase().includes(q)
    );
  }, [challenges, search]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1612',
        }}>Challenges</h1>
        <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', textDecoration: 'none' }}>
          <Plus size={14} />
          Add Challenge
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 280, marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9184' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search challenges..."
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

      {/* Challenge list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Trophy size={32} style={{ color: '#c4b896', marginBottom: 12 }} />
          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: '#9a9184' }}>
            {search ? 'No challenges match your search' : 'No challenges yet'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((challenge, i) => {
            const statusInfo = STATUS_MAP[challenge.status] || STATUS_MAP.draft;
            const statusColor = `var(--${statusInfo.color})`;
            return (
              <div
                key={challenge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '16px 20px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  animation: `fsu .2s ease ${i * 0.04}s both`,
                }}
              >
                <Trophy size={16} style={{ color: '#8b6914', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 13,
                    color: '#1a1612',
                    fontWeight: 600,
                  }}>{challenge.name}</div>
                  <div style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: 10,
                    color: '#9a9184',
                  }}>
                    {challenge.roleTitle} · {challenge.candIds?.length || 0} candidates
                  </div>
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
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
      )}
    </div>
  );
}
