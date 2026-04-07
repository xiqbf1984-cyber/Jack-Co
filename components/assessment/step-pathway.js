'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { TAXONOMY } from '@/lib/constants';
import { Search } from 'lucide-react';

export default function StepPathway() {
  var cluster = useAssessmentStore(function (s) { return s.cluster; });
  var updatePathway = useAssessmentStore(function (s) { return s.updatePathway; });
  var updateSelectedRole = useAssessmentStore(function (s) { return s.updateSelectedRole; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var role = useAssessmentStore(function (s) { return s.role; });

  var [search, setSearch] = useState('');
  var hasJD = !!role.jd;
  var clusterData = TAXONOMY[cluster.id];
  var pathways = clusterData?.pathways || [];

  var handleSelectRole = function (pathway, r) {
    updatePathway({ id: pathway.id, name: pathway.name });
    updateSelectedRole({
      id: r.id,
      name: r.name,
      oneLiner: r.oneLiner,
      sourceOccupations: r.sourceOccupations || [],
      taskCategories: r.taskCategories || [],
    });
    completeStep(2);
  };

  if (!clusterData) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
          Please go back and select an industry first.
        </p>
      </div>
    );
  }

  var q = search.toLowerCase();

  // Flatten all roles across pathways for marketplace view
  var allRoles = [];
  pathways.forEach(function (pw) {
    (pw.roles || []).forEach(function (r) {
      allRoles.push({ ...r, pathway: pw });
    });
  });

  // Filter by search
  var filtered = q ? allRoles.filter(function (r) {
    return r.name.toLowerCase().includes(q) || r.oneLiner.toLowerCase().includes(q) || r.pathway.name.toLowerCase().includes(q);
  }) : allRoles;

  // Group by pathway for display
  var groupedByPathway = {};
  filtered.forEach(function (r) {
    var key = r.pathway.id;
    if (!groupedByPathway[key]) groupedByPathway[key] = { pathway: r.pathway, roles: [] };
    groupedByPathway[key].roles.push(r);
  });

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Select Role for {cluster.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Choose the AI-native role to assess candidates against
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
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

      {/* Roles grouped by pathway/category */}
      {Object.values(groupedByPathway).map(function (group) {
        return (
          <div key={group.pathway.id} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              color: 'var(--brown-light)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 10,
            }}>
              {group.pathway.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {group.roles.map(function (r) {
                var isRecommended = hasJD && r.id === allRoles[0]?.id;
                return (
                  <button
                    key={r.id}
                    onClick={function () { handleSelectRole(r.pathway, r); }}
                    style={{
                      position: 'relative', padding: '16px 18px', borderRadius: 12,
                      border: isRecommended ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
                      backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left',
                      transition: 'box-shadow 0.15s ease',
                    }}
                    onMouseEnter={function (e) { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={function (e) { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {isRecommended && (
                      <span style={{
                        position: 'absolute', top: -8, left: 12,
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                        color: '#fff', backgroundColor: 'var(--gold)',
                        padding: '1px 8px', borderRadius: 4,
                      }}>Recommended</span>
                    )}
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 600, marginBottom: 4 }}>
                      {r.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.5 }}>
                      {r.oneLiner}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            No roles match your search
          </p>
        </div>
      )}
    </div>
  );
}
