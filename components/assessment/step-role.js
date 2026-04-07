'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import Link from 'next/link';
import { Plus, Briefcase } from 'lucide-react';

export default function StepRole() {
  var updateRole = useAssessmentStore(function (s) { return s.updateRole; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var roles = useAppStore(function (s) { return s.roles; });
  var [selectedId, setSelectedId] = useState(role.selectedRoleId || null);

  var handleSelectRole = function (r) {
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

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Select a Role
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Link this assessment to a role you've created
        </p>
      </div>

      {/* Existing roles section */}
      {roles.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: 10,
          }}>
            Your Roles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {roles.map(function (r) {
              var isSelected = selectedId === r.id;
              var statusColor = r.status === 'active' ? 'var(--accent-green)' : 'var(--brown-soft)';
              return (
                <button
                  key={r.id}
                  onClick={function () { handleSelectRole(r); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 12,
                    border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border-default)',
                    backgroundColor: isSelected ? 'rgba(139,105,20,0.04)' : '#fff',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s ease', boxSizing: 'border-box',
                  }}
                  onMouseEnter={function (e) { if (!isSelected) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                  onMouseLeave={function (e) { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: 'rgba(139,105,20,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Briefcase size={14} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                      {r.title}
                    </div>
                    {r.dept && (
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 2 }}>
                        {r.dept}
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: statusColor }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)' }}>
                      {(r.status || 'draft').charAt(0).toUpperCase() + (r.status || 'draft').slice(1)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Create new role section */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          color: 'var(--brown-light)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 10,
        }}>
          {roles.length > 0 ? 'Or Create New' : 'Get Started'}
        </div>
        <Link href="/roles/create" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 18px', borderRadius: 12,
          border: '1px dashed var(--border-default)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          textDecoration: 'none',
          transition: 'all 0.15s ease',
        }}
          onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.backgroundColor = '#fff'; }}
          onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'; }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: 'rgba(139,105,20,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Plus size={14} style={{ color: 'var(--brown-soft)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
              Create a New Role
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>
              Define a position and generate a JD with AI
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
