'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import { Check } from 'lucide-react';

function Section({ label, children, show }) {
  if (!show) return null;
  return (
    <div style={{ marginTop: 16, animation: 'fsu .2s ease' }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: 'var(--brown-light)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
      padding: '5px 0',
      fontSize: 11,
      fontFamily: 'var(--font-body)',
    }}>
      <span style={{ color: 'var(--brown-light)', flexShrink: 0 }}>{label}</span>
      <span style={{
        color: 'var(--brown)',
        textAlign: 'right',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 140,
      }}>
        {value}
      </span>
    </div>
  );
}

export default function LivePreview() {
  const cluster = useAssessmentStore((s) => s.cluster);
  const pathway = useAssessmentStore((s) => s.pathway);
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const task = useAssessmentStore((s) => s.task);
  const context = useAssessmentStore((s) => s.context);
  const environment = useAssessmentStore((s) => s.environment);
  const candidates = useAssessmentStore((s) => s.candidates);

  const hasAnything = cluster.name || pathway.name || selectedRole.name || task.name;

  return (
    <div style={{ padding: '18px 16px' }}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--brown)',
        marginBottom: 2,
      }}>
        Preview
      </div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: 'var(--brown-light)',
        marginBottom: 12,
      }}>
        Updates as you go
      </div>

      {!hasAnything && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--brown-light)',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          Complete each step to see your assessment take shape.
        </p>
      )}

      {/* Summary rows */}
      <Section label="Summary" show={hasAnything}>
        <Row label="Industry" value={cluster.name} />
        <Row label="Pathway" value={pathway.name} />
        <Row label="Role" value={selectedRole.name} />
        <Row label="Task" value={task.code ? `${task.code}` : ''} />
      </Section>

      {/* Context */}
      <Section label="Context" show={!!context.description}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: 'var(--brown-muted)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {context.description?.slice(0, 100)}...
        </p>
      </Section>

      {/* Environment */}
      <Section label="Environment" show={!!environment.contextText}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Check size={10} style={{ color: 'var(--accent-green)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--accent-green)' }}>Ready</span>
        </div>
      </Section>

      {/* Candidates */}
      <Section label="Candidates" show={candidates.length > 0}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: 'var(--brown)',
        }}>
          {candidates.length} assigned
        </span>
      </Section>
    </div>
  );
}
