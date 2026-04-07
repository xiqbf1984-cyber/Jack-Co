'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import Link from 'next/link';

export default function StepRole() {
  const updateRole = useAssessmentStore((s) => s.updateRole);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const roles = useAppStore((s) => s.roles);

  const [selectedId, setSelectedId] = useState(role.selectedRoleId || null);

  const handleSelectRole = (r) => {
    setSelectedId(r.id);

    updateRole({
      selectedRoleId: r.id,
      jd: r.jd || '',
      title: r.title || '',
      department: r.dept || '',
      parsedFrom: 'existing-role',
    });

    completeStep(0);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--accent-green)';
      case 'draft': return 'var(--brown-soft)';
      default: return 'var(--brown-soft)';
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--brown)',
          margin: 0,
          marginBottom: 4,
        }}>
          Select a Role
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-soft)',
          margin: 0,
        }}>
          Choose an existing role or create a new one
        </p>
      </div>

      {/* Role cards list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.length === 0 && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            textAlign: 'center',
            padding: '24px 0',
          }}>
            No roles yet. Create one to get started.
          </p>
        )}

        {roles.map((r) => {
          const isSelected = selectedId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelectRole(r)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                border: isSelected
                  ? '2px solid var(--gold)'
                  : '1px solid var(--border-default)',
                backgroundColor: isSelected ? 'rgba(139,105,20,0.04)' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--brown)',
                  marginBottom: 4,
                }}>
                  {r.title}
                </div>
                {r.dept && (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--brown-soft)',
                  }}>
                    {r.dept}
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: statusColor(r.status),
                backgroundColor: r.status === 'active'
                  ? 'rgba(76,175,80,0.08)'
                  : 'rgba(139,105,20,0.06)',
                padding: '4px 10px',
                borderRadius: 20,
                flexShrink: 0,
                marginLeft: 12,
              }}>
                {r.status || 'draft'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Create New Role link */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link
          href="/roles/create"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--gold)',
            textDecoration: 'none',
          }}
        >
          + Create New Role
        </Link>
      </div>
    </div>
  );
}
