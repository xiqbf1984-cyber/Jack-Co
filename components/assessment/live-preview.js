'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import { Users, Paperclip, Check } from 'lucide-react';

function SectionDivider({ label }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 9,
      color: 'var(--brown-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginTop: 20,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ flex: 1, borderTop: '1px solid var(--border-light)' }} />
      {label}
      <span style={{ flex: 1, borderTop: '1px solid var(--border-light)' }} />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid var(--border-light)',
    }}>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: 'var(--brown-muted)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: value ? 'var(--brown)' : 'var(--brown-light)',
        maxWidth: 160,
        textAlign: 'right',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value || '(pending)'}
      </span>
    </div>
  );
}

function PlaceholderText({ text }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      color: 'var(--brown-light)',
      fontStyle: 'italic',
      lineHeight: 1.5,
    }}>
      {text}
    </p>
  );
}

export default function LivePreview() {
  const currentStep = useAssessmentStore((s) => s.currentStep);
  const role = useAssessmentStore((s) => s.role);
  const cluster = useAssessmentStore((s) => s.cluster);
  const pathway = useAssessmentStore((s) => s.pathway);
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const task = useAssessmentStore((s) => s.task);
  const context = useAssessmentStore((s) => s.context);
  const environment = useAssessmentStore((s) => s.environment);
  const candidates = useAssessmentStore((s) => s.candidates);
  const rubrics = useAssessmentStore((s) => s.rubrics);

  return (
    <div style={{ padding: '24px 20px' }}>
      {/* Header */}
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 15,
        color: 'var(--brown)',
        marginBottom: 2,
      }}>
        Assessment Preview
      </h3>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        color: 'var(--brown-light)',
        marginBottom: 16,
      }}>
        Live Preview
      </div>

      {/* Candidate count (after step 6) */}
      {candidates.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          borderRadius: 8,
          backgroundColor: 'var(--cream)',
          marginBottom: 16,
          animation: 'fsu .25s ease',
        }}>
          <Users size={13} style={{ color: 'var(--brown-muted)' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown)',
          }}>
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* SUMMARY */}
      <SectionDivider label="SUMMARY" />
      <div>
        <SummaryRow label="Industry" value={cluster.name} />
        <SummaryRow label="Pathway" value={pathway.name} />
        <SummaryRow label="Role" value={selectedRole.name || role.title} />
        <SummaryRow label="Task" value={task.name ? `${task.code} ${task.name}` : ''} />
      </div>

      {/* BUSINESS CONTEXT */}
      <SectionDivider label="BUSINESS CONTEXT" />
      {context.description ? (
        <div style={{ animation: 'fsu .25s ease' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown)',
            lineHeight: 1.5,
            marginBottom: 8,
          }}>
            {context.description.length > 160
              ? context.description.slice(0, 160) + '...'
              : context.description}
          </p>
          {context.files && context.files.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-muted)',
            }}>
              <Paperclip size={10} />
              {context.files.length} file{context.files.length !== 1 ? 's' : ''} attached
            </div>
          )}
        </div>
      ) : (
        <PlaceholderText text="Complete Step 5 to fill this section" />
      )}

      {/* ASSESSMENT ENV */}
      <SectionDivider label="ASSESSMENT ENV" />
      {environment.contextText ? (
        <div style={{ animation: 'fsu .25s ease' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 6,
          }}>
            <Check size={11} style={{ color: 'var(--accent-green)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--accent-green)',
            }}>Generated</span>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            color: 'var(--brown-muted)',
            lineHeight: 1.4,
          }}>
            Context: {environment.contextText.slice(0, 80)}...
          </p>
          {environment.deliverables.length > 0 && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-muted)',
              marginTop: 2,
            }}>
              Deliverables: {environment.deliverables.length} items
            </p>
          )}
          {environment.resources.length > 0 && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-muted)',
              marginTop: 2,
            }}>
              Resources: {environment.resources.length} items
            </p>
          )}
        </div>
      ) : (
        <PlaceholderText text="Complete Step 6 to fill this section" />
      )}

      {/* CANDIDATES */}
      {candidates.length > 0 && (
        <>
          <SectionDivider label="CANDIDATES" />
          <div style={{ animation: 'fsu .25s ease' }}>
            {candidates.map((c, i) => (
              <div key={c.id} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                color: 'var(--brown)',
                lineHeight: 1.6,
              }}>
                {i + 1}. {c.email}{c.name ? ` (${c.name})` : ''}{c.timezone ? ` — ${c.timezone.split('/').pop()}` : ''}{c.duration ? ` — ${c.duration}` : ''}
              </div>
            ))}
          </div>
        </>
      )}

      {/* RUBRICS */}
      <SectionDivider label="RUBRICS" />
      {rubrics.dimensions.length > 0 ? (
        <div style={{ animation: 'fsu .25s ease' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown)',
          }}>
            {rubrics.dimensions.length} dims · {rubrics.totalRubrics} rubrics
            {rubrics.redFlags?.length > 0 ? ` · ${rubrics.redFlags.length} red flags` : ''}
          </p>
        </div>
      ) : (
        <PlaceholderText text="Complete Step 8 to fill this section" />
      )}
    </div>
  );
}
