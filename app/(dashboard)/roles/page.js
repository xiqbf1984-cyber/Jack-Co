'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Briefcase, Trophy, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function RolesPage() {
  const roles = useAppStore((s) => s.roles);
  const assessments = useAppStore((s) => s.assessments);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.dept?.toLowerCase().includes(q)
    );
  }, [roles, search]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--brown)',
        }}>Roles</h1>
        <Link href="/roles/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', textDecoration: 'none' }}>
          <Plus size={14} />
          Add Role
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 260, marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
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

      {/* Roles list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Briefcase size={32} style={{ color: 'var(--brown-light)', marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            {search ? 'No roles match your search' : 'No roles yet'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((role) => {
            const statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            const statusColor = `var(--${statusInfo.color})`;
            const isExpanded = expandedId === role.id;
            const roleAssessments = assessments.filter((a) => a.roleId === role.id);

            return (
              <div key={role.id}>
                <div
                  onClick={() => setExpandedId(isExpanded ? null : role.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '16px 20px',
                    borderRadius: isExpanded ? '10px 10px 0 0' : 10,
                    border: '1px solid var(--border-default)',
                    borderBottom: isExpanded ? '1px solid var(--border-light)' : undefined,
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ChevronRight
                    size={14}
                    style={{
                      color: 'var(--brown-soft)',
                      flexShrink: 0,
                      transition: 'transform 0.15s ease',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  />
                  <Briefcase size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--brown)',
                      fontWeight: 600,
                    }}>{role.title}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      color: 'var(--brown-soft)',
                    }}>{role.dept}</div>
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

                {/* Expanded assessment sub-list */}
                {isExpanded && roleAssessments.length > 0 && (
                  <div style={{
                    paddingLeft: 20,
                    padding: '10px 20px 10px 44px',
                    background: '#faf6ef',
                    borderRadius: '0 0 10px 10px',
                    border: '1px solid var(--border-default)',
                    borderTop: 'none',
                  }}>
                    {roleAssessments.map((a, ai) => {
                      const aStatus = STATUS_MAP[a.status] || STATUS_MAP.draft;
                      const aColor = `var(--${aStatus.color})`;
                      return (
                        <div
                          key={a.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 8,
                            marginBottom: ai < roleAssessments.length - 1 ? 6 : 0,
                            animation: `fsd .15s ease ${ai * 0.04}s both`,
                          }}
                        >
                          <Trophy size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 11,
                              color: 'var(--brown)',
                              fontWeight: 600,
                            }}>{a.name}</div>
                            <div style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 9,
                              color: 'var(--brown-soft)',
                            }}>{a.candIds?.length || 0} candidates</div>
                          </div>
                          <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 9,
                            fontWeight: 500,
                            padding: '4px 10px',
                            borderRadius: 10,
                            backgroundColor: `color-mix(in srgb, ${aColor} 12%, transparent)`,
                            color: aColor,
                          }}>{aStatus.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isExpanded && roleAssessments.length === 0 && (
                  <div style={{
                    padding: '12px 16px 12px 40px',
                    background: '#faf6ef',
                    borderRadius: '0 0 10px 10px',
                    border: '1px solid var(--border-default)',
                    borderTop: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--brown-soft)',
                  }}>
                    No assessments linked to this role yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
