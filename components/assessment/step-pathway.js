'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { TAXONOMY } from '@/lib/constants';
import { ChevronRight, ChevronDown } from 'lucide-react';

const RECOMMENDED_PATHWAY = 'business-info-mgmt';
const RECOMMENDED_ROLE = 'decision-science-analyst';

export default function StepPathway() {
  const cluster = useAssessmentStore((s) => s.cluster);
  const updatePathway = useAssessmentStore((s) => s.updatePathway);
  const updateSelectedRole = useAssessmentStore((s) => s.updateSelectedRole);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;
  const clusterData = TAXONOMY[cluster.id];
  const pathways = clusterData?.pathways || [];

  const defaultExpanded = hasJD ? RECOMMENDED_PATHWAY : (pathways[0]?.id || '');
  const [expandedPathway, setExpandedPathway] = useState(defaultExpanded);

  const togglePathway = (id) => {
    setExpandedPathway(expandedPathway === id ? null : id);
  };

  const handleSelectRole = (pathway, r) => {
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
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
          Please go back and select an industry cluster first.
        </p>
      </div>
    );
  }

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
          Select the career pathway and AI-native role for <strong>{cluster.name}</strong>.
        </p>
      </div>

      {/* Pathway list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pathways.map((pw) => {
          const isExpanded = expandedPathway === pw.id;
          const isRecommended = hasJD && pw.id === RECOMMENDED_PATHWAY;

          return (
            <div key={pw.id}>
              {/* Pathway header */}
              <button
                onClick={() => togglePathway(pw.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: isRecommended
                    ? '1px solid rgba(139,105,20,0.3)'
                    : '1px solid var(--border-default)',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: isExpanded ? 0 : 0,
                }}
              >
                {isExpanded
                  ? <ChevronDown size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  : <ChevronRight size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                }
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  flex: 1,
                }}>
                  {pw.name}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: 'var(--brown-light)',
                }}>
                  {pw.roles.length} role{pw.roles.length !== 1 ? 's' : ''}
                </span>
              </button>

              {/* Expanded roles */}
              {isExpanded && (
                <div style={{
                  padding: '10px 0 0 24px',
                  animation: 'fsd .15s ease',
                }}>
                  {pw.roles.map((r) => {
                    const isRoleRecommended = hasJD && r.id === RECOMMENDED_ROLE;

                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRole(pw, r)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '16px 18px',
                          borderRadius: 12,
                          border: isRoleRecommended
                            ? '1px solid rgba(139,105,20,0.3)'
                            : '1px solid var(--border-default)',
                          backgroundColor: 'var(--cream-card)',
                          cursor: 'pointer',
                          marginBottom: 8,
                          position: 'relative',
                          transition: 'box-shadow 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Recommended tag */}
                        {isRoleRecommended && (
                          <span style={{
                            position: 'absolute',
                            top: 12,
                            right: 14,
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: 'var(--gold)',
                          }}>
                            Recommended
                          </span>
                        )}

                        <div style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: 'var(--brown)',
                          fontWeight: 700,
                          marginBottom: 6,
                        }}>
                          {r.name}
                        </div>

                        <div style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          color: 'var(--brown-muted)',
                          lineHeight: 1.5,
                          marginBottom: 8,
                        }}>
                          {r.oneLiner}
                        </div>

                        {/* Source occupations */}
                        {r.sourceOccupations && r.sourceOccupations.length > 0 && (
                          <div style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: 'var(--brown-light)',
                          }}>
                            From: {r.sourceOccupations.map((s) => s.title).join(' · ')}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
