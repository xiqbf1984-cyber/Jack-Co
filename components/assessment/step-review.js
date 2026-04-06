'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import { ChevronDown, ChevronUp, Trash2, Plus, Loader2, Mail } from 'lucide-react';

const mockRubrics = [
  {
    id: 'deliverable-quality', name: 'Deliverable Quality', description: 'All required artifacts produced in working condition',
    rubrics: [
      { id: 'r1', title: 'Incident classification taxonomy complete', description: 'All store incident types from data classified', weight: 'Essential', score: 9 },
      { id: 'r2', title: 'Handoff sequence fully specified', description: 'Complete sequence between all teams', weight: 'Essential', score: 8 },
      { id: 'r3', title: 'Confidence routing thresholds per category', description: 'Separate thresholds for each system', weight: 'Important', score: 7 },
    ],
    pitfalls: [
      { id: 'p1', title: 'Missing POS-specific safeguards', description: 'No separate handling for payment systems', weight: 'Major', score: -6 },
    ],
  },
  {
    id: 'analytical-rigor', name: 'Analytical Rigor', description: 'Analyses correct, consistent, and well-reasoned',
    rubrics: [
      { id: 'r4', title: 'Data-driven incident categorization', description: 'Used actual ticket data to classify', weight: 'Essential', score: 9 },
      { id: 'r5', title: 'Volume projection methodology', description: 'Scalable projection from pilot to full deployment', weight: 'Important', score: 6 },
    ],
    pitfalls: [],
  },
  {
    id: 'framework-design', name: 'Framework Design', description: 'Operating model comprehensive and configurable',
    rubrics: [
      { id: 'r6', title: 'Conservative and aggressive variants', description: 'Two operating modes provided', weight: 'Important', score: 7 },
      { id: 'r7', title: 'L1 team sustainability analysis', description: 'Assessment of outsourced team capacity', weight: 'Important', score: 5 },
    ],
    pitfalls: [],
  },
  {
    id: 'communication', name: 'Communication', description: 'VP can walk through it, executive-ready',
    rubrics: [
      { id: 'r8', title: 'Executive summary present', description: 'One-page overview for leadership', weight: 'Important', score: 6 },
    ],
    pitfalls: [],
  },
  {
    id: 'ai-collaboration', name: 'AI Collaboration', description: 'Used AI tools effectively and critically',
    rubrics: [
      { id: 'r9', title: 'Appropriate AI tool usage', description: 'Used AI for data analysis, not just text generation', weight: 'Optional', score: 3 },
    ],
    pitfalls: [],
  },
  {
    id: 'prioritization', name: 'Prioritization', description: 'Focused on what matters',
    rubrics: [
      { id: 'r10', title: 'POS outage root cause addressed', description: 'Specifically prevents recurrence', weight: 'Optional', score: 3 },
    ],
    pitfalls: [],
  },
];

const redFlags = [
  { id: 'rf1', title: 'No deliverable produced', description: 'Output not an operating model', score: -327 },
  { id: 'rf2', title: 'Fabricated data', description: 'Invented ticket data or statistics', score: -327 },
];

const weightColors = {
  Essential: 'var(--accent-green)',
  Important: 'var(--gold)',
  Optional: 'var(--brown-light)',
};

const weightOptions = ['Essential', 'Important', 'Optional'];

function DimensionRow({ dimension, onUpdateRubric, onDeleteRubric, onAddRubric }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      borderBottom: expanded ? '2px solid var(--border-light)' : undefined,
    }}>
      {/* Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 0.5fr',
          padding: '12px 14px',
          borderTop: '1px solid var(--border-light)',
          cursor: 'pointer',
          transition: 'background-color 0.1s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream-card)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {dimension.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--brown-muted)',
        }}>
          {dimension.description}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: 'var(--brown)',
          textAlign: 'right',
        }}>
          {dimension.rubrics.length}
        </span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{
          padding: '14px 18px 16px',
          backgroundColor: 'var(--cream-card)',
          animation: 'fsd .15s ease',
        }}>
          {dimension.rubrics.map((rubric) => (
            <div key={rubric.id} style={{
              padding: '12px 0',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown)',
                  }}>
                    {rubric.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--brown-muted)',
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}>
                    {rubric.description}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: weightColors[rubric.weight] || 'var(--brown-light)',
                  }}>
                    {rubric.weight} ({rubric.score})
                  </span>
                  <select
                    value={rubric.weight}
                    onChange={(e) => onUpdateRubric(rubric.id, { weight: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '2px 4px',
                      borderRadius: 4,
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--cream)',
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: 'var(--brown)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {weightOptions.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteRubric(rubric.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <Trash2 size={12} style={{ color: 'var(--brown-light)' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pitfalls */}
          {dimension.pitfalls.length > 0 && (
            <>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: 'var(--brown-muted)',
                textTransform: 'uppercase',
                marginTop: 12,
                marginBottom: 8,
              }}>
                Pitfalls & Red Flags
              </div>
              {dimension.pitfalls.map((pitfall) => (
                <div key={pitfall.id} style={{
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ color: 'var(--red)', fontSize: 12 }}>⚠</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)' }}>{pitfall.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)', marginTop: 2 }}>{pitfall.description}</div>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: 'var(--red)',
                  }}>
                    {pitfall.weight} ({pitfall.score})
                  </span>
                </div>
              ))}
            </>
          )}

          {/* Add rubric */}
          <button
            onClick={onAddRubric}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 10,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px dashed var(--border-default)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--gold)',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} /> Add custom rubric
          </button>
        </div>
      )}
    </div>
  );
}

// ====== SUCCESS PAGE ======

function SuccessPage({ task, role, candidateCount, onDashboard, onCreateAnother }) {
  const steps = [
    { icon: '📧', title: 'Candidates notified', desc: 'Email invitations sent within 5 minutes with assessment details and time window.' },
    { icon: '⏱', title: 'Assessment window opens', desc: "Each candidate's timer starts based on their schedule." },
    { icon: '📊', title: 'Results appear', desc: 'Scores populate in Evaluation dashboard as candidates submit.' },
    { icon: '🔔', title: 'Completion notification', desc: 'Email when all candidates have submitted or windows expire.' },
  ];

  return (
    <div style={{
      textAlign: 'center',
      padding: '30px 0',
      animation: 'fadeScale .3s ease',
    }}>
      {/* Icon */}
      <div style={{
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: 'rgba(39,130,91,0.12)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        <Mail size={28} style={{ color: 'var(--accent-green)' }} />
      </div>

      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 24,
        color: 'var(--brown)',
        marginBottom: 8,
      }}>
        Assessment Sent
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--brown-muted)',
        marginBottom: 4,
      }}>
        {task.name || 'Assessment'}
      </p>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--brown-light)',
        marginBottom: 32,
      }}>
        {candidateCount} candidate{candidateCount !== 1 ? 's' : ''} will receive their invitation.
      </p>

      {/* What happens next */}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: 'var(--brown-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: 14,
      }}>
        ── What happens next ──
      </div>

      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        {steps.map((step, i) => (
          <div key={step.title} style={{
            display: 'flex',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            backgroundColor: '#fff',
            marginBottom: 8,
            textAlign: 'left',
            animation: `fsu .2s ease ${i * 0.08}s both`,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'var(--cream-row-even)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 14,
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--brown)',
              }}>
                {step.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown-muted)',
                marginTop: 3,
                lineHeight: 1.4,
              }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reminders */}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: 'var(--brown-muted)',
        textTransform: 'uppercase',
        marginTop: 28,
        marginBottom: 12,
      }}>
        ── Reminders ──
      </div>

      <div style={{
        maxWidth: 420,
        margin: '0 auto',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: 'var(--brown-muted)',
        lineHeight: 1.6,
      }}>
        <p style={{ marginBottom: 4 }}>• Monitor progress in real-time on the Assessments tab</p>
        <p style={{ marginBottom: 4 }}>• Candidates who haven't started after 24h receive an automatic reminder</p>
        <p style={{ marginBottom: 4 }}>• You can extend deadlines or resend invitations anytime</p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginTop: 28,
      }}>
        <button onClick={onDashboard} className="btn-primary">
          Go to Dashboard
        </button>
        <button onClick={onCreateAnother} className="btn-secondary">
          Create Another Assessment
        </button>
      </div>
    </div>
  );
}

// ====== MAIN COMPONENT ======

export default function StepReview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [dimensions, setDimensions] = useState([]);

  const candidates = useAssessmentStore((s) => s.candidates);
  const task = useAssessmentStore((s) => s.task);
  const role = useAssessmentStore((s) => s.role);
  const reset = useAssessmentStore((s) => s.reset);
  const addAssessment = useAppStore((s) => s.addAssessment);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDimensions(mockRubrics);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateRubric = (rubricId, data) => {
    setDimensions((dims) =>
      dims.map((dim) => ({
        ...dim,
        rubrics: dim.rubrics.map((r) => r.id === rubricId ? { ...r, ...data } : r),
      }))
    );
  };

  const handleDeleteRubric = (rubricId) => {
    setDimensions((dims) =>
      dims.map((dim) => ({
        ...dim,
        rubrics: dim.rubrics.filter((r) => r.id !== rubricId),
      }))
    );
  };

  const handleAddRubric = (dimId) => {
    setDimensions((dims) =>
      dims.map((dim) => {
        if (dim.id !== dimId) return dim;
        return {
          ...dim,
          rubrics: [...dim.rubrics, {
            id: 'custom-' + Date.now(),
            title: 'Custom rubric',
            description: 'Edit this rubric description',
            weight: 'Optional',
            score: 3,
          }],
        };
      })
    );
  };

  const handleSend = () => {
    // Add assessment to global store
    addAssessment({
      name: task.name || 'New Assessment',
      roleId: null,
      roleTitle: role.title,
      status: 'published',
      skill: task.categoryName,
      task: task.name,
      candIds: candidates.map((c) => c.id),
      results: [],
    });
    setSent(true);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
      }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 16 }} />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-muted)',
        }}>
          Building assessment environment and generating evaluation rubrics...
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--brown-light)',
          marginTop: 4,
        }}>
          This usually takes a few seconds.
        </p>
      </div>
    );
  }

  if (sent) {
    return (
      <SuccessPage
        task={task}
        role={role}
        candidateCount={candidates.length}
        onDashboard={() => { reset(); router.push('/dashboard'); }}
        onCreateAnother={() => { reset(); }}
      />
    );
  }

  const totalRubrics = dimensions.reduce((sum, d) => sum + d.rubrics.length, 0);

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
          Here are the evaluation rubrics for this assessment. You can adjust weights, add or remove rubrics, and confirm when ready.
        </p>
      </div>

      {/* Rubrics table */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          color: 'var(--brown)',
          marginBottom: 14,
        }}>
          Evaluation Rubrics
        </h2>

        <div style={{
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr 0.5fr',
            padding: '10px 14px',
            backgroundColor: 'var(--cream-row-even)',
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--brown-muted)' }}>DIMENSION</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--brown-muted)' }}>WHAT WE LOOK FOR</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--brown-muted)', textAlign: 'right' }}>#</span>
          </div>

          {/* Dimension rows */}
          {dimensions.map((dim) => (
            <DimensionRow
              key={dim.id}
              dimension={dim}
              onUpdateRubric={handleUpdateRubric}
              onDeleteRubric={handleDeleteRubric}
              onAddRubric={() => handleAddRubric(dim.id)}
            />
          ))}

          {/* Red flags row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr 0.5fr',
            padding: '12px 14px',
            borderTop: '2px solid var(--border-light)',
          }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)' }}>Red Flags</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)' }}>Disqualification</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'var(--brown)', textAlign: 'right' }}>{redFlags.length}</span>
          </div>
        </div>

        {/* Total */}
        <div style={{
          textAlign: 'right',
          marginTop: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: 'var(--brown-muted)',
        }}>
          Total: {totalRubrics + redFlags.length}
        </div>
      </div>

      {/* Scoring system card */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: 'var(--brown-muted)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          SCORING SYSTEM
        </div>

        {/* Positive scores */}
        {[
          { cls: 'Essential', range: '8-10', meaning: 'Core requirement', color: 'var(--accent-green)' },
          { cls: 'Important', range: '4-7', meaning: 'Expected feature', color: 'var(--gold)' },
          { cls: 'Optional', range: '2-3', meaning: 'Bonus polish', color: 'var(--brown-light)' },
        ].map((row) => (
          <div key={row.cls} style={{ display: 'flex', gap: 16, padding: '5px 0' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: row.color, width: 70 }}>{row.cls}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--brown-muted)', width: 50 }}>{row.range}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)' }}>{row.meaning}</span>
          </div>
        ))}

        <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '8px 0' }} />

        {/* Negative scores */}
        {[
          { cls: 'Critical', range: '-8 to -9', meaning: 'Severe error' },
          { cls: 'Major', range: '-4 to -6', meaning: 'Significant defect' },
          { cls: 'Minor', range: '-2 to -3', meaning: 'Small issue' },
          { cls: 'Red Flag', range: '-327', meaning: 'Instant disqualification' },
        ].map((row) => (
          <div key={row.cls} style={{ display: 'flex', gap: 16, padding: '5px 0' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--red)', width: 70 }}>{row.cls}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--brown-muted)', width: 50 }}>{row.range}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)' }}>{row.meaning}</span>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <button
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleSend}
      >
        Confirm Rubrics & Send to Candidates
      </button>
    </div>
  );
}
