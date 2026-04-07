'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { INDUSTRY_CLUSTERS, CAREER_CLUSTER_GROUPS } from '@/lib/constants';
import { Search } from 'lucide-react';

const RECOMMENDED_CLUSTER = 'digital-technology';

export default function StepCluster() {
  var updateCluster = useAssessmentStore(function (s) { return s.updateCluster; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var [search, setSearch] = useState('');

  var hasJD = !!role.jd;

  var handleSelect = function (c) {
    if (c.status !== 'active') return;
    updateCluster({ id: c.id, name: c.name });
    completeStep(1);
  };

  var clusterMap = {};
  INDUSTRY_CLUSTERS.forEach(function (c) { clusterMap[c.id] = c; });

  var q = search.toLowerCase();

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Select Career Cluster
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Choose the industry that best matches this role
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
        <input
          type="text" value={search} onChange={function (e) { setSearch(e.target.value); }}
          placeholder="Search industries..."
          style={{
            width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
            borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Career cluster groups */}
      {CAREER_CLUSTER_GROUPS.map(function (group) {
        var clusters = group.ids.map(function (id) { return clusterMap[id]; }).filter(Boolean);
        if (q) {
          clusters = clusters.filter(function (c) {
            return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
          });
        }
        if (clusters.length === 0) return null;

        return (
          <div key={group.name} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              color: 'var(--brown-light)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 10,
            }}>
              {group.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {clusters.map(function (c, i) {
                var isActive = c.status === 'active';
                var isRecommended = hasJD && c.id === RECOMMENDED_CLUSTER;
                return (
                  <button
                    key={c.id}
                    onClick={function () { handleSelect(c); }}
                    disabled={!isActive}
                    style={{
                      position: 'relative', padding: '14px 16px', borderRadius: 12,
                      border: isRecommended ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
                      backgroundColor: '#fff', cursor: isActive ? 'pointer' : 'default',
                      opacity: isActive ? 1 : 0.5, textAlign: 'left',
                      transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                    }}
                    onMouseEnter={function (e) { if (isActive) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
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
                    {!isActive && (
                      <span style={{
                        position: 'absolute', top: 8, right: 10,
                        fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--brown-light)',
                        backgroundColor: 'var(--cream)', padding: '2px 6px', borderRadius: 4,
                      }}>Soon</span>
                    )}
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 500 }}>
                      {c.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 4, lineHeight: 1.4 }}>
                      {c.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
