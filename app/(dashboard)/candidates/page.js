'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Search, Plus, Users, MoreHorizontal } from 'lucide-react';

const statusColors = {
  active: '#27825b',
  completed: '#27825b',
  idle: '#c4b896',
  pending: '#d4880f',
};

const GRID_COLUMNS = '2fr 2fr 100px 80px 100px 40px';

export default function CandidatesPage() {
  const candidates = useAppStore((s) => s.candidates);
  const openModal = useAppStore((s) => s.openAddCandidateModal);
  const [search, setSearch] = useState('');

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-scale" style={{ padding: 'var(--page-padding-y) var(--page-padding-x)', maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-display-page">Candidates</h1>
        <button onClick={openModal} className="btn-primary">
          <Plus size={14} /> Add Candidate
        </button>
      </div>
      <p className="text-body-lg mb-8">Manage your candidate pool and track their progress.</p>

      {/* Search + Filter row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--brown-soft)' }} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
            style={{
              backgroundColor: 'var(--cream-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--brown)',
            }}
          />
        </div>
        <button className="btn-secondary text-body-xs">
          Status
        </button>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card)' }}>
          {/* Header */}
          <div
            className="grid gap-4 px-6 py-3.5 border-b"
            style={{ gridTemplateColumns: GRID_COLUMNS, borderColor: 'var(--border-light)', backgroundColor: 'var(--cream-sidebar)' }}
          >
            <span className="text-mono-label">Candidate</span>
            <span className="text-mono-label">Email</span>
            <span className="text-mono-label">Timezone</span>
            <span className="text-mono-label">Joined</span>
            <span className="text-mono-label">Status</span>
            <span />
          </div>
          {filtered.map((cand, i) => (
            <div
              key={cand.id}
              className="grid gap-4 px-6 py-4.5 border-b last:border-b-0 transition-colors duration-150 hover-bg-cream-card-hover"
              style={{
                gridTemplateColumns: GRID_COLUMNS,
                borderColor: 'var(--border-light)',
                backgroundColor: i % 2 === 1 ? 'var(--cream-row-even)' : undefined,
                animation: `fsu 0.2s ease-out ${i * 0.04}s both`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                    color: 'var(--brown)',
                  }}
                >
                  {cand.avatar}
                </div>
                <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{cand.name}</span>
              </div>
              <span className="text-body-xs self-center" style={{ color: 'var(--brown-soft)' }}>{cand.email}</span>
              <span className="text-mono-tag self-center">{cand.tz}</span>
              <span className="text-body-xs self-center" style={{ color: 'var(--brown-soft)' }}>{cand.joined}</span>
              <div className="flex items-center gap-1.5 self-center">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[cand.status] }} />
                <span className="text-mono-tag" style={{ color: statusColors[cand.status] }}>{cand.status}</span>
              </div>
              <div className="flex items-center justify-center self-center">
                <button
                  className="w-7 h-7 rounded-md flex items-center justify-center hover-bg-dim transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-soft)' }}
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto mb-4" style={{ color: 'var(--brown-light)' }} />
          <p className="text-body-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>No candidates yet</p>
          <p className="text-body-xs">Add your first candidate above.</p>
        </div>
      )}

      {/* Row count */}
      {filtered.length > 0 && (
        <div className="mt-4">
          <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
            Showing {filtered.length} candidate{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
