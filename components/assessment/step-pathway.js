'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { TAXONOMY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Star, Users } from 'lucide-react';

const RECOMMENDED_PATHWAY = 'software-development';
const RECOMMENDED_ROLE = 'ai-software-engineer';

export default function StepPathway() {
  const cluster = useAssessmentStore((s) => s.cluster);
  const updatePathway = useAssessmentStore((s) => s.updatePathway);
  const updateSelectedRole = useAssessmentStore((s) => s.updateSelectedRole);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;
  const clusterData = TAXONOMY[cluster.id];
  const pathways = clusterData?.pathways || [];

  const defaultExpanded = hasJD ? RECOMMENDED_PATHWAY : (pathways[0]?.id || '');
  const [expandedPathway, setExpandedPathway] = useState(defaultExpanded);
  const [hoveredRole, setHoveredRole] = useState(null);

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
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h1 className="text-display-page mb-2">Select the career pathway and AI-native role</h1>
        <p className="text-body-lg">
          Please go back and select an industry cluster first.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: 720 }}>
      <h1 className="text-display-page mb-2">Select the career pathway and AI-native role</h1>
      <p className="text-body-lg mb-6">
        Choose a pathway within <strong style={{ color: 'var(--gold)' }}>{cluster.name}</strong>, then pick the role that best matches.
      </p>

      <div className="space-y-2">
        {pathways.map((pw) => {
          const isExpanded = expandedPathway === pw.id;
          const isRecommended = hasJD && pw.id === RECOMMENDED_PATHWAY;

          return (
            <div
              key={pw.id}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: isRecommended
                  ? '1px solid var(--gold-light)'
                  : '1px solid var(--border-default)',
                backgroundColor: 'var(--cream-card)',
              }}
            >
              {/* Pathway header */}
              <button
                type="button"
                onClick={() => togglePathway(pw.id)}
                className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150 hover-bg-cream"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={16} style={{ color: 'var(--brown-soft)' }} />
                  ) : (
                    <ChevronRight size={16} style={{ color: 'var(--brown-soft)' }} />
                  )}
                  <span
                    className="text-body-sm font-semibold"
                    style={{ color: 'var(--brown)' }}
                  >
                    {pw.name}
                  </span>
                  {isRecommended && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-mono-tag"
                      style={{
                        backgroundColor: 'rgba(139,105,20,0.08)',
                        color: 'var(--gold)',
                      }}
                    >
                      <Star size={9} />
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} style={{ color: 'var(--brown-soft)' }} />
                  <span className="text-body-xs">
                    {pw.roles.length} role{pw.roles.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>

              {/* Expanded role cards */}
              {isExpanded && (
                <div className="px-5 pb-4 space-y-2 animate-fsd">
                  {pw.roles.map((r) => {
                    const isRoleRecommended = hasJD && r.id === RECOMMENDED_ROLE;
                    const isSelected = selectedRole.id === r.id;
                    const isHovered = hoveredRole === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectRole(pw, r)}
                        onMouseEnter={() => setHoveredRole(r.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                        className={cn(
                          'w-full text-left rounded-lg p-4 transition-all duration-200',
                          'hover:shadow-sm'
                        )}
                        style={{
                          border: isSelected
                            ? '2px solid var(--accent-green)'
                            : isRoleRecommended
                              ? '1.5px solid var(--gold)'
                              : '1px solid var(--border-default)',
                          backgroundColor: isSelected
                            ? 'rgba(39,130,91,0.04)'
                            : 'var(--cream)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-body-sm font-semibold"
                                style={{ color: 'var(--brown)' }}
                              >
                                {r.name}
                              </span>
                              {isRoleRecommended && (
                                <span
                                  className="text-mono-tag px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: 'rgba(139,105,20,0.08)',
                                    color: 'var(--gold)',
                                  }}
                                >
                                  Recommended match
                                </span>
                              )}
                            </div>
                            <p className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
                              {r.oneLiner}
                            </p>

                            {/* Source occupations on hover */}
                            {isHovered && r.sourceOccupations && r.sourceOccupations.length > 0 && (
                              <div className="mt-3 pt-3 space-y-1.5 animate-fsd" style={{ borderTop: '1px solid var(--border-light)' }}>
                                <span className="text-mono-label">SOURCE OCCUPATIONS</span>
                                {r.sourceOccupations.map((so, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                      style={{ backgroundColor: 'var(--brown-light)' }}
                                    />
                                    <div>
                                      <span className="text-body-xs font-semibold" style={{ color: 'var(--brown)' }}>
                                        {so.title}
                                      </span>
                                      <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
                                        {' '}{so.contribution}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
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
