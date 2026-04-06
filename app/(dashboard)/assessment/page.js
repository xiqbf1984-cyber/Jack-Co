'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Trophy, ArrowLeft, Filter } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function AssessmentsPage() {
  const assessments = useAppStore((s) => s.assessments);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return assessments;
    const q = search.toLowerCase();
    return assessments.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.roleTitle?.toLowerCase().includes(q)
    );
  }, [assessments, search]);

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
          }}>Assessments</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            marginTop: 4,
          }}>Create and manage candidate assessments</p>
        </div>
        <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 13 }}>
          <Plus size={14} />
          Add Assessment
        </Link>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assessments..."
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
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px',
          borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', cursor: 'pointer',
        }}>
          <Filter size={13} />
          Status
        </button>
      </div>

      {/* Assessment list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Trophy size={32} style={{ color: 'var(--brown-light)', marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            {search ? 'No assessments match your search' : 'No assessments yet'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((assessment, i) => {
            const statusInfo = STATUS_MAP[assessment.status] || STATUS_MAP.draft;
            const statusColor = `var(--${statusInfo.color})`;
            return (
              <Link
                href={`/assessment/${assessment.id}`}
                key={assessment.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 20px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  animation: `fsu .2s ease ${i * 0.04}s both`,
                  textDecoration: 'none',
                  transition: 'box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Trophy size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--brown)',
                    fontWeight: 600,
                  }}>{assessment.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--brown-soft)',
                  }}>
                    {assessment.roleTitle} · {assessment.candIds?.length || 0} candidates
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: statusColor,
                  }}>{statusInfo.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
