'use client';

import { useAssessmentStore } from '@/stores/assessment-store';

function Placeholder() {
  return (
    <span
      className="font-mono text-[11px] tracking-wider"
      style={{ color: 'var(--brown-light)' }}
    >
      {'·····················'}
    </span>
  );
}

function SectionHeader({ children }) {
  return (
    <h4 className="text-mono-label mb-2 mt-5 first:mt-0">{children}</h4>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-3 py-1.5">
      <span className="text-body-xs shrink-0">{label}</span>
      <span className="text-body-sm text-right" style={{ color: 'var(--brown)' }}>
        {value || <Placeholder />}
      </span>
    </div>
  );
}

export default function LivePreview() {
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
    <div style={{ padding: 24, borderLeft: '1px solid var(--border-light)' }}>
      {/* Header */}
      <h3
        className="text-display-section mb-1"
        style={{ fontSize: 14 }}
      >
        Assessment Preview
      </h3>
      <div
        className="h-px mb-4"
        style={{ backgroundColor: 'var(--border-light)' }}
      />

      {/* Summary */}
      <SectionHeader>SUMMARY</SectionHeader>
      <div
        className="rounded-lg p-3 mb-1"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        <Row label="Industry" value={cluster.name} />
        <Row label="Pathway" value={pathway.name} />
        <Row label="Role" value={selectedRole.name || role.title} />
        <Row label="Task" value={task.name} />
      </div>

      {/* Business Context */}
      <SectionHeader>BUSINESS CONTEXT</SectionHeader>
      <div
        className="rounded-lg p-3 mb-1"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {context.description ? (
          <p className="text-body-sm" style={{ color: 'var(--brown)' }}>
            {context.description.length > 180
              ? context.description.slice(0, 180) + '...'
              : context.description}
          </p>
        ) : (
          <p className="text-body-xs" style={{ color: 'var(--brown-light)' }}>
            Complete Step 5
          </p>
        )}
      </div>

      {/* Assessment Environment */}
      <SectionHeader>ASSESSMENT ENVIRONMENT</SectionHeader>
      <div
        className="rounded-lg p-3 mb-1"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {environment.contextText ? (
          <div className="space-y-1">
            <p className="text-body-sm" style={{ color: 'var(--brown)' }}>
              {environment.contextText.length > 120
                ? environment.contextText.slice(0, 120) + '...'
                : environment.contextText}
            </p>
            {environment.deliverables.length > 0 && (
              <p className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
                {environment.deliverables.length} deliverable{environment.deliverables.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        ) : (
          <p className="text-body-xs" style={{ color: 'var(--brown-light)' }}>
            Complete Step 6
          </p>
        )}
      </div>

      {/* Candidates */}
      <SectionHeader>CANDIDATES</SectionHeader>
      <div
        className="rounded-lg p-3 mb-1"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {candidates.length > 0 ? (
          <div className="space-y-1">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold"
                  style={{
                    backgroundColor: 'var(--border-default)',
                    color: 'var(--brown)',
                  }}
                >
                  {(c.name || c.email || '?').charAt(0).toUpperCase()}
                </div>
                <span className="text-body-sm" style={{ color: 'var(--brown)' }}>
                  {c.name || c.email}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-xs" style={{ color: 'var(--brown-light)' }}>
            Complete Step 7
          </p>
        )}
      </div>

      {/* Rubrics */}
      <SectionHeader>RUBRICS</SectionHeader>
      <div
        className="rounded-lg p-3"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {rubrics.dimensions.length > 0 ? (
          <p className="text-body-sm" style={{ color: 'var(--brown)' }}>
            {rubrics.dimensions.length} dimension{rubrics.dimensions.length !== 1 ? 's' : ''}
            {rubrics.totalRubrics > 0 && ` / ${rubrics.totalRubrics} rubrics`}
          </p>
        ) : (
          <p className="text-body-xs" style={{ color: 'var(--brown-light)' }}>
            Complete Step 8
          </p>
        )}
      </div>
    </div>
  );
}
