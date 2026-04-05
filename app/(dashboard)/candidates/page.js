'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Search, Plus, Users, MoreHorizontal, ArrowUpDown, Filter, Settings2 } from 'lucide-react';

const statusColors = {
  active: '#27825b',
  completed: '#27825b',
  idle: '#c4b896',
  pending: '#d4880f',
};

const GRID_COLUMNS = '2fr 100px 100px 80px 120px 40px';

export default function CandidatesPage() {
  const candidates = useAppStore((s) => s.candidates);
  const openModal = useAppStore((s) => s.openAddCandidateModal);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const list = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      switch (sortField) {
        case 'name':
          return dir * a.name.localeCompare(b.name);
        case 'status':
          return dir * a.status.localeCompare(b.status);
        case 'trials':
          return dir * ((a.trials || 0) - (b.trials || 0));
        case 'lastActive':
          return dir * (a.lastActive || '').localeCompare(b.lastActive || '');
        default:
          return 0;
      }
    });
    return list;
  }, [filtered, sortField, sortDir]);

  const SortHeader = ({ field, children }) => (
    <button
      onClick={() => toggleSort(field)}
      className="table-header-sortable"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 500,
        color: sortField === field ? 'var(--brown)' : 'var(--brown-soft)',
        transition: 'color 0.15s ease',
      }}
    >
      {children}
      <ArrowUpDown size={12} style={{ opacity: sortField === field ? 1 : 0.4 }} />
    </button>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-display-page">Candidates</h1>
      </div>
      <p className="text-body-lg mb-6">Manage your candidate pool and track their progress</p>

      {/* Search + Filter + Actions row */}
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
        <button className="btn-secondary text-body-xs" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Filter size={12} />
          Status
        </button>
        <div className="flex-1" />
        <button onClick={openModal} className="btn-primary">
          Add Candidate
        </button>
        <button
          className="btn-icon"
          title="View settings"
          style={{ width: 36, height: 36 }}
        >
          <Settings2 size={15} />
        </button>
      </div>

      {/* Table */}
      {sorted.length > 0 ? (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card)' }}>
          {/* Header */}
          <div
            className="grid gap-4 px-6 py-3 border-b items-center"
            style={{ gridTemplateColumns: GRID_COLUMNS, borderColor: 'var(--border-light)' }}
          >
            <SortHeader field="name">Candidate</SortHeader>
            <SortHeader field="status">Status</SortHeader>
            <span className="text-mono-label">Timezone</span>
            <SortHeader field="trials">Trials</SortHeader>
            <SortHeader field="lastActive">Last Active</SortHeader>
            <span />
          </div>
          {sorted.map((cand, i) => (
            <div
              key={cand.id}
              className="grid gap-4 px-6 py-4 border-b last:border-b-0 transition-colors duration-150 hover-bg-cream-card-hover items-center"
              style={{
                gridTemplateColumns: GRID_COLUMNS,
                borderColor: 'var(--border-light)',
                animation: `fsu 0.2s ease-out ${i * 0.04}s both`,
              }}
            >
              {/* Candidate: avatar + name + email */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                    color: 'var(--brown)',
                  }}
                >
                  {cand.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-body-sm font-semibold truncate" style={{ color: 'var(--brown)' }}>{cand.name}</div>
                  <div className="text-body-xs truncate" style={{ color: 'var(--brown-soft)' }}>{cand.email}</div>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColors[cand.status] }} />
                <span className="text-mono-tag" style={{ color: statusColors[cand.status] }}>{cand.status}</span>
              </div>
              {/* Timezone */}
              <span className="text-mono-tag">{cand.tz}</span>
              {/* Trials */}
              <span className="text-mono-data" style={{ color: 'var(--brown)' }}>{cand.trials || 0}</span>
              {/* Last Active */}
              <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>{cand.lastActive || '\u2014'}</span>
              {/* Actions */}
              <div className="flex items-center justify-center">
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
      {sorted.length > 0 && (
        <div className="mt-4">
          <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
            Viewing {sorted.length} rows
          </span>
        </div>
      )}
    </div>
  );
}
