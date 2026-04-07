'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import Link from 'next/link';
import { Plus, Briefcase, Search } from 'lucide-react';

export default function StepRole() {
  var updateRole = useAssessmentStore(function (s) { return s.updateRole; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var roles = useAppStore(function (s) { return s.roles; });
  var [selectedId, setSelectedId] = useState(role.selectedRoleId || null);
  var [search, setSearch] = useState('');

  var handleSelectRole = function (r) {
    setSelectedId(r.id);
    updateRole({
      selectedRoleId: r.id,
      jd: r.jd || '',
      title: r.title || '',
      department: r.dept || '',
      parsedFrom: 'existing-role',
    });
    // Step 0 complete → go to step 1 (Task)
    completeStep(0);
    goToStep(1);
  };

  var q = search.toLowerCase();
  var filtered = q ? roles.filter(function (r) {
    return r.title.toLowerCase().includes(q) || (r.dept || '').toLowerCase().includes(q);
  }) : roles;

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

      {/* Search */}
      {roles.length > 2 && (
        <div style={{ position: 'relative', marginBottom: 16, maxWidth: 400 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input
            type="text" value={search} onChange={function (e) { setSearch(e.target.value); }}
            placeholder="Search roles..."
            style={{
              width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Existing roles + Create New in same grid */}
      <div style={{ marginBottom: 24 }}>
        {roles.length > 0 && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: 10,
          }}>
            Your Roles
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {filtered.map(function (r) {
            var isSelected = selectedId === r.id;
            var statusColor = r.status === 'active' ? 'var(--accent-green)' : 'var(--brown-soft)';
            return (
              <button
                key={r.id}
                onClick={function () { handleSelectRole(r); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 10,
                  border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border-default)',
                  backgroundColor: isSelected ? 'rgba(139,105,20,0.04)' : '#fff',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease', boxSizing: 'border-box',
                }}
                onMouseEnter={function (e) { if (!isSelected) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {r.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 1 }}>
                    {r.dept}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: statusColor }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--brown-soft)' }}>
                    {(r.status || 'draft').charAt(0).toUpperCase() + (r.status || 'draft').slice(1)}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Create New Role — same size as a role card */}
          <Link href="/roles/create" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 10,
            border: '1px dashed var(--border-default)',
            backgroundColor: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', transition: 'all 0.15s ease',
            boxSizing: 'border-box',
          }}
            onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.backgroundColor = '#fff'; }}
            onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'; }}
          >
            <Plus size={14} style={{ color: 'var(--brown-soft)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)' }}>
                Create New Role
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 1 }}>
                Generate a JD with AI
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
