'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Trophy } from 'lucide-react';
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
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--brown)',
        }}>Assessments</h1>
        <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', textDecoration: 'none' }}>
          <Plus size={14} />
          Add Assessment
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 280, marginBottom: 20 }}>
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
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 8,
            border: '1px solid var(--border-default)',
            background: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--brown)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((assessment, i) => {
            const statusInfo = STATUS_MAP[assessment.status] || STATUS_MAP.draft;
            const statusColor = `var(--${statusInfo.color})`;
            return (
              <div
                key={assessment.id}
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
                    fontSize: 10,
                    color: 'var(--brown-soft)',
                  }}>
                    {assessment.roleTitle} · {assessment.candIds?.length || 0} candidates
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
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
