'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Trophy, MoreVertical } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

function AssessmentActions({ id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brown-light)', borderRadius: 4 }}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 140,
          backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-dropdown)', zIndex: 20, overflow: 'hidden', animation: 'fsd 0.12s ease both',
        }}>
          <Link href={'/assessment/' + id} style={{ display: 'block', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >View Details</Link>
          <button style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >Duplicate</button>
          <button style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >Archive</button>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  var diff = Date.now() - new Date(dateStr).getTime();
  var days = Math.floor(diff / 86400000);
  if (days === 0) return 'Created today';
  if (days === 1) return 'Created 1 day ago';
  return 'Created ' + days + ' days ago';
}

export default function AssessmentsPage() {
  const assessments = useAppStore((s) => s.assessments);
  const candidates = useAppStore((s) => s.candidates);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    var list = assessments;
    if (activeTab !== 'all') {
      var statusMap = { draft: ['draft'], active: ['published', 'active', 'pending'], archived: ['expired', 'completed'] };
      var statuses = statusMap[activeTab] || [];
      list = list.filter((a) => statuses.includes(a.status));
    }
    if (search.trim()) {
      var q = search.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || (a.roleTitle || '').toLowerCase().includes(q));
    }
    return list;
  }, [assessments, search, activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>Trials</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>Manage work trials and candidate assessments</p>
        </div>
        <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 12 }}>
          Create Trial
        </Link>
      </div>

      {/* Search + Tab filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 220 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trials..."
            style={{
              width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          background: '#fff',
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 14px',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--brown)' : 'var(--brown-soft)',
                backgroundColor: activeTab === tab.id ? 'var(--cream)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Assessment cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Trophy size={32} style={{ color: 'var(--brown-light)', marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            {search || activeTab !== 'all' ? 'No trials match your filters' : 'No trials yet'}
          </p>
          {!search && activeTab === 'all' && (
            <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16, padding: '8px 18px', fontSize: 12, textDecoration: 'none' }}>
              Create your first trial
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((assessment, i) => {
            var statusInfo = STATUS_MAP[assessment.status] || STATUS_MAP.draft;
            var statusColor = 'var(--' + statusInfo.color + ')';
            var candCount = assessment.candIds?.length || 0;

            return (
              <Link
                href={'/assessment/' + assessment.id}
                key={assessment.id}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  animation: 'fsu .2s ease ' + (i * 0.04) + 's both',
                  textDecoration: 'none',
                  transition: 'box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Top row: status badge + actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.04)',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)' }}>{statusInfo.label}</span>
                  </div>
                  <AssessmentActions id={assessment.id} />
                </div>

                {/* Title */}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
                  {assessment.name}
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                    {timeAgo(assessment.createdAt)}
                  </span>

                  {/* Candidate avatars */}
                  {candCount > 0 && (
                    <div style={{ display: 'flex' }}>
                      {(assessment.candIds || []).slice(0, 3).map((candId, ci) => {
                        var cand = candidates.find(c => c.id === candId);
                        var initials = cand?.avatar || '?';
                        return (
                          <div key={candId} style={{
                            width: 24, height: 24, borderRadius: '50%',
                            backgroundColor: avatarColors[ci % avatarColors.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginLeft: ci > 0 ? -6 : 0,
                            border: '2px solid #fff',
                            zIndex: 3 - ci,
                          }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 600, color: '#fff' }}>{initials}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Footer */}
          <div style={{ padding: '8px 0' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
              Viewing <strong style={{ color: 'var(--brown)' }}>{filtered.length}</strong> rows
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
