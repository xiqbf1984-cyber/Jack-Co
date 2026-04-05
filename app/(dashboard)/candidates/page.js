'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Search, Plus, Users } from 'lucide-react';

const statusColors = {
  active: '#27825b',
  completed: '#27825b',
  idle: '#c4b896',
  pending: '#d4880f',
};

export default function CandidatesPage() {
  const candidates = useAppStore((s) => s.candidates);
  const openModal = useAppStore((s) => s.openAddCandidateModal);
  const [search, setSearch] = useState('');

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-scale" style={{ padding: '32px 40px', maxWidth: 1080 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display-page">Candidates</h1>
        <button onClick={openModal} className="btn-primary">
          <Plus size={14} /> Add Candidate
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brown-soft)' }} />
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
          style={{
            backgroundColor: 'var(--cream)',
            borderColor: 'var(--border-default)',
            color: 'var(--brown)',
          }}
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
          {/* Header */}
          <div
            className="grid gap-4 px-4 py-2.5 border-b"
            style={{ gridTemplateColumns: '1fr 1fr 100px 80px 100px', borderColor: 'var(--border-light)', backgroundColor: 'var(--cream-sidebar)' }}
          >
            <span className="text-mono-label">Name</span>
            <span className="text-mono-label">Email</span>
            <span className="text-mono-label">Timezone</span>
            <span className="text-mono-label">Joined</span>
            <span className="text-mono-label">Status</span>
          </div>
          {filtered.map((cand, i) => (
            <div
              key={cand.id}
              className="grid gap-4 px-4 py-3 border-b last:border-b-0 transition-colors duration-150"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: i % 2 === 1 ? 'var(--cream-row-even)' : undefined,
                animation: `fsu 0.2s ease-out ${i * 0.04}s both`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono font-bold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                    color: 'var(--brown)',
                  }}
                >
                  {cand.avatar}
                </div>
                <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{cand.name}</span>
              </div>
              <span className="text-body-xs self-center">{cand.email}</span>
              <span className="text-mono-tag self-center">{cand.tz}</span>
              <span className="text-body-xs self-center">{cand.joined}</span>
              <div className="flex items-center gap-1.5 self-center">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[cand.status] }} />
                <span className="text-mono-tag" style={{ color: statusColors[cand.status] }}>{cand.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users size={40} className="mx-auto mb-3" style={{ color: 'var(--brown-light)' }} />
          <p className="text-body-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>No candidates yet</p>
          <p className="text-body-xs">Add your first candidate above.</p>
        </div>
      )}
    </div>
  );
}
