'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

var MOCK_RUBRICS = [
  {
    id: 'deliverable-quality', name: 'Deliverable Quality',
    description: 'All required artifacts produced in working condition',
    criteria: [
      { id: 'r1', title: 'Incident classification taxonomy complete', description: 'All store incident types from data classified', weight: 'Essential' },
      { id: 'r2', title: 'Handoff sequence fully specified', description: 'Complete sequence between all teams', weight: 'Essential' },
      { id: 'r3', title: 'Confidence routing thresholds per category', description: 'Separate thresholds for each system', weight: 'Important' },
    ],
  },
  {
    id: 'analytical-rigor', name: 'Analytical Rigor',
    description: 'Analyses correct, consistent, and well-reasoned',
    criteria: [
      { id: 'r4', title: 'Data-driven incident categorization', description: 'Used actual ticket data to classify', weight: 'Essential' },
      { id: 'r5', title: 'Volume projection methodology', description: 'Scalable projection from pilot to full deployment', weight: 'Important' },
    ],
  },
  {
    id: 'communication', name: 'Communication',
    description: 'VP can walk through it, executive-ready',
    criteria: [
      { id: 'r6', title: 'Executive summary present', description: 'One-page overview for leadership', weight: 'Important' },
    ],
  },
  {
    id: 'ai-collaboration', name: 'AI Collaboration',
    description: 'Used AI tools effectively and critically',
    criteria: [
      { id: 'r7', title: 'Appropriate AI tool usage', description: 'Used AI for data analysis, not just text generation', weight: 'Optional' },
    ],
  },
];

export default function StepRubrics() {
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var [dimensions, setDimensions] = useState(MOCK_RUBRICS);
  var [expandedId, setExpandedId] = useState(MOCK_RUBRICS[0]?.id || null);

  function handleContinue() {
    completeStep(4);
    goToStep(5);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Evaluation Rubrics
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Define how candidates will be scored on this assessment
        </p>
      </div>

      {/* Rubric dimensions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {dimensions.map(function (dim) {
          var isExpanded = expandedId === dim.id;
          return (
            <div key={dim.id} style={{
              borderRadius: 12, border: '1px solid var(--border-default)',
              background: '#fff', overflow: 'hidden',
            }}>
              {/* Dimension header */}
              <button
                onClick={function () { setExpandedId(isExpanded ? null : dim.id); }}
                style={{
                  display: 'flex', alignItems: 'center', width: '100%',
                  padding: '14px 18px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', gap: 10,
                }}
              >
                {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--brown-soft)' }} /> : <ChevronDown size={14} style={{ color: 'var(--brown-soft)' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                    {dim.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>
                    {dim.description}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-light)',
                  backgroundColor: 'var(--cream)', padding: '2px 8px', borderRadius: 4,
                }}>
                  {dim.criteria.length} criteria
                </span>
              </button>

              {/* Expanded: criteria table */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-light)' }}>
                  {/* Table header */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 2fr 80px 40px',
                    padding: '8px 18px', backgroundColor: 'var(--cream)',
                    borderBottom: '1px solid var(--border-light)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Title</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Description</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Weight</span>
                    <span />
                  </div>

                  {/* Criteria rows */}
                  {dim.criteria.map(function (c) {
                    var weightColor = c.weight === 'Essential' ? 'var(--accent-green)' : c.weight === 'Important' ? 'var(--gold)' : 'var(--brown-light)';
                    return (
                      <div key={c.id} style={{
                        display: 'grid', gridTemplateColumns: '1fr 2fr 80px 40px',
                        padding: '10px 18px', borderBottom: '1px solid var(--border-light)',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 500 }}>
                          {c.title}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                          {c.description}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: weightColor, fontWeight: 600 }}>
                          {c.weight}
                        </span>
                        <button style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                          color: 'var(--brown-light)', display: 'flex', alignItems: 'center',
                        }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add criterion */}
                  <div style={{ padding: '10px 18px' }}>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                      <Plus size={12} /> Add Criterion
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue */}
      <button onClick={handleContinue} className="btn-primary" style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 24px', fontSize: 13,
      }}>
        Continue to Candidates
      </button>
    </div>
  );
}
