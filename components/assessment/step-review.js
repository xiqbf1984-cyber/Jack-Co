'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import { Loader2, Mail, ArrowRight } from 'lucide-react';

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

  const candidates = useAssessmentStore((s) => s.candidates);
  const task = useAssessmentStore((s) => s.task);
  const role = useAssessmentStore((s) => s.role);
  const reset = useAssessmentStore((s) => s.reset);
  const rubrics = useAssessmentStore((s) => s.rubrics);
  const goToStep = useAssessmentStore((s) => s.goToStep);
  const addAssessment = useAppStore((s) => s.addAssessment);

  const dimensions = rubrics.dimensions || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
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
          Preparing final review...
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

  const totalCriteria = dimensions.reduce((sum, d) => sum + (d.criteria || d.rubrics || []).length, 0);

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
          Review the assessment details below and confirm when ready to send to candidates.
        </p>
      </div>

      {/* Rubrics summary */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--brown-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Rubrics Summary
          </div>
          <button
            onClick={() => goToStep(4)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            Edit Rubrics <ArrowRight size={10} />
          </button>
        </div>

        {dimensions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dimensions.map((dim) => {
              const count = (dim.criteria || dim.rubrics || []).length;
              return (
                <div key={dim.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 8,
                  backgroundColor: 'var(--cream)',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>
                    {dim.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-light)' }}>
                    {count} criteria
                  </span>
                </div>
              );
            })}
            <div style={{
              textAlign: 'right', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brown-muted)',
            }}>
              Total: {totalCriteria}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '16px', textAlign: 'center',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-light)',
          }}>
            No rubrics defined yet.
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleSend}
      >
        Confirm & Send to Candidates
      </button>
    </div>
  );
}
