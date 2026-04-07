'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Users, MoreHorizontal, CirclePlus, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

const STATUS_OPTIONS = [
  { value: 'idle', label: 'Idle' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

function StatusFilterDropdown({ selectedStatuses, onChange }) {
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = STATUS_OPTIONS.filter(s =>
    s.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  function toggle(value) {
    if (selectedStatuses.includes(value)) {
      onChange(selectedStatuses.filter(s => s !== value));
    } else {
      onChange([...selectedStatuses, value]);
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: selectedStatuses.length > 0 ? 'var(--brown)' : 'var(--brown-soft)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <CirclePlus size={13} />
        Status
        {selectedStatuses.length > 0 && (
          <span style={{
            marginLeft: 2,
            padding: '0 6px',
            borderRadius: 10,
            backgroundColor: 'var(--cream)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--brown)',
          }}>{selectedStatuses.length}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 6,
          width: 200,
          backgroundColor: '#fff',
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-dropdown)',
          zIndex: 20,
          overflow: 'hidden',
          animation: 'fsd 0.15s ease both',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--brown-soft)',
              }} />
              <input
                autoFocus
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Status"
                style={{
                  width: '100%',
                  padding: '6px 8px 6px 26px',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  background: 'transparent',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Options */}
          <div style={{ padding: '4px 0' }}>
            {filtered.map((opt) => {
              const checked = selectedStatuses.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{
                    width: 15,
                    height: 15,
                    borderRadius: 3,
                    border: '1.5px solid ' + (checked ? 'var(--gold)' : 'var(--border-default)'),
                    background: checked ? 'var(--gold)' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}>
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateActions({ candId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const removeCandidate = useAppStore((s) => s.removeCandidate);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 4, color: 'var(--brown-light)',
          borderRadius: 4, transition: 'all 0.1s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 4,
          width: 140,
          backgroundColor: '#fff',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-dropdown)',
          zIndex: 20,
          overflow: 'hidden',
          animation: 'fsd 0.12s ease both',
        }}>
          <button
            onClick={() => { setOpen(false); }}
            style={{
              width: '100%', padding: '8px 12px', border: 'none', background: 'transparent',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
              cursor: 'pointer', textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >View Profile</button>
          <button
            onClick={() => { setOpen(false); }}
            style={{
              width: '100%', padding: '8px 12px', border: 'none', background: 'transparent',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
              cursor: 'pointer', textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >Send Invite</button>
          {removeCandidate && (
            <button
              onClick={() => { removeCandidate(candId); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 12px', border: 'none', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)',
                cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >Remove</button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CandidatesPage() {
  const candidates = useAppStore((s) => s.candidates);
  const openModal = useAppStore((s) => s.openAddCandidateModal);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);


  const filtered = useMemo(() => {
    let list = candidates;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length > 0) {
      list = list.filter((c) => statusFilter.includes(c.status));
    }
    return list;
  }, [candidates, search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
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

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 240 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            style={{
              width: '100%',
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--border-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
          />
        </div>
        <StatusFilterDropdown selectedStatuses={statusFilter} onChange={setStatusFilter} />
        {statusFilter.length > 0 && (
          <button
            onClick={() => setStatusFilter([])}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', borderRadius: 6,
              border: 'none', background: 'var(--cream)',
              fontFamily: 'var(--font-body)', fontSize: 11,
              color: 'var(--brown-soft)', cursor: 'pointer',
            }}
          >
            <X size={10} />
            Clear filters
          </button>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={openModal} className="btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>
            Add Candidate
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div style={{
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          background: '#fff',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 40px',
            padding: '0 16px',
            height: 42,
            alignItems: 'center',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--cream)',
          }}>
            {[
              { label: 'Candidate', sortable: true },
              { label: 'Status', sortable: true },
              { label: 'Timezone', sortable: false },
              { label: 'Assessments', sortable: true },
              { label: 'Last Active', sortable: true },
              { label: '', sortable: false },
            ].map((h, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--brown-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                cursor: h.sortable ? 'pointer' : 'default',
              }}>
                {h.label}
                {h.sortable && h.label && (
                  <span style={{ fontSize: 9, opacity: 0.5 }}>&#8597;</span>
                )}
              </span>
            ))}
          </div>

          {/* Data rows */}
          {filtered.map((cand, i) => {
            const statusInfo = STATUS_MAP[cand.status] || STATUS_MAP.idle;
            const statusColor = 'var(--' + statusInfo.color + ')';
            const initials = cand.avatar || cand.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
            const bgColor = avatarColors[i % avatarColors.length];

            return (
              <div
                key={cand.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 40px',
                  padding: '0 16px',
                  height: 58,
                  alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Candidate */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#fff',
                    }}>{initials}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--brown)',
                    }}>{cand.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 10px',
                    borderRadius: 12,
                    backgroundColor: statusColor.replace('var(--', '').replace(')', '') === 'brown-light' ? 'rgba(196,184,150,0.15)' : undefined,
                    background: 'rgba(0,0,0,0.04)',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: statusColor,
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--brown)',
                    }}>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Timezone */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                }}>{cand.tz}</span>

                {/* Assessments */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                }}>{cand.assessments}</span>

                {/* Last Active */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown-soft)',
                }}>{cand.lastActive || '\u2014'}</span>

                {/* Actions */}
                <CandidateActions candId={cand.id} />
              </div>
            );
          })}

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--cream)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown-soft)',
            }}>Viewing <strong style={{ color: 'var(--brown)' }}>{filtered.length}</strong> rows</span>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'rgba(139,105,20,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Users size={22} style={{ color: 'var(--gold)' }} />
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--brown)',
            marginBottom: 4,
          }}>
            {search || statusFilter.length > 0 ? 'No matches found' : 'No candidates yet'}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            maxWidth: 320,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {search || statusFilter.length > 0
              ? 'Try adjusting your search or filters'
              : 'Add candidates to your pool to start tracking their progress and evaluating their performance.'}
          </p>
          {!search && statusFilter.length === 0 && (
            <button onClick={openModal} className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>
              Add Candidate
            </button>
          )}
        </div>
      )}
    </div>
  );
}
