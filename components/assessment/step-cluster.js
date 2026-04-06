'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import { INDUSTRY_CLUSTERS } from '@/lib/constants';

const RECOMMENDED_CLUSTER = 'digital-technology';

export default function StepCluster() {
  const updateCluster = useAssessmentStore((s) => s.updateCluster);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;

  const handleSelect = (c) => {
    if (c.status !== 'active') return;
    updateCluster({ id: c.id, name: c.name });
    completeStep(1);
  };

  return (
    <div>
      {/* AI bubble */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 14,
        backgroundColor: 'rgba(139,105,20,0.04)',
        border: '1px solid var(--border-light)',
        marginBottom: 20,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Which industry does this role belong to?
        </p>
      </div>

      {/* Recommendation hint */}
      {hasJD && (
        <div style={{
          backgroundColor: 'rgba(39,130,91,0.05)',
          border: '1px solid rgba(39,130,91,0.15)',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 16,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--accent-green)',
            margin: 0,
          }}>
            Based on your JD, we recommend <strong>Digital Technology</strong>
          </p>
        </div>
      )}

      {/* Cluster grid — 2 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        {INDUSTRY_CLUSTERS.map((c, i) => {
          const isActive = c.status === 'active';
          const isRecommended = hasJD && c.id === RECOMMENDED_CLUSTER;

          return (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              disabled={!isActive}
              style={{
                position: 'relative',
                padding: '16px 18px',
                borderRadius: 14,
                border: isRecommended
                  ? '1.5px solid rgba(139,105,20,0.3)'
                  : '1.5px solid var(--border-default)',
                backgroundColor: '#fff',
                cursor: isActive ? 'pointer' : 'default',
                opacity: isActive ? 1 : 0.5,
                textAlign: 'left',
                animation: `fsu .2s ease ${i * 0.03}s both`,
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (isActive) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Coming Soon tag */}
              {!isActive && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  color: 'var(--brown-light)',
                  backgroundColor: 'var(--cream-row-even)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}>
                  Soon
                </span>
              )}

              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                fontWeight: isRecommended ? 700 : 400,
              }}>
                {c.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown-muted)',
                marginTop: 4,
                lineHeight: 1.4,
              }}>
                {c.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
