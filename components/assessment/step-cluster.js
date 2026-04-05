'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import { INDUSTRY_CLUSTERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Lock, Star } from 'lucide-react';

const RECOMMENDED_CLUSTER = 'digital-technology';

export default function StepCluster() {
  const updateCluster = useAssessmentStore((s) => s.updateCluster);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const cluster = useAssessmentStore((s) => s.cluster);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;

  const handleSelect = (c) => {
    if (c.status !== 'active') return;
    updateCluster({ id: c.id, name: c.name });
    completeStep(1);
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 720 }}>
      <h1 className="text-display-page mb-2">Which industry does this role belong to?</h1>
      {hasJD && (
        <p className="text-body-lg mb-1">
          Based on your JD, we recommend{' '}
          <strong style={{ color: 'var(--gold)' }}>Digital Technology</strong>
        </p>
      )}
      <p className="text-body-sm mb-6" style={{ color: 'var(--brown-soft)' }}>
        Select the industry cluster that best matches the role you are hiring for.
      </p>

      {/* Cluster grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {INDUSTRY_CLUSTERS.map((c) => {
          const isActive = c.status === 'active';
          const isRecommended = c.id === RECOMMENDED_CLUSTER && hasJD;
          const isSelected = cluster.id === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c)}
              disabled={!isActive}
              className={cn(
                'group relative rounded-xl p-4 text-left transition-all duration-200',
                isActive
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-not-allowed opacity-50'
              )}
              style={{
                border: isSelected
                  ? '2px solid var(--accent-green)'
                  : isRecommended
                    ? '2px solid var(--gold)'
                    : '1px solid var(--border-default)',
                backgroundColor: isSelected
                  ? 'rgba(39,130,91,0.04)'
                  : 'var(--cream-card)',
              }}
            >
              {/* Badges */}
              {isRecommended && !isSelected && (
                <span
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-mono-tag"
                  style={{
                    backgroundColor: 'rgba(139,105,20,0.08)',
                    color: 'var(--gold)',
                  }}
                >
                  <Star size={9} />
                  Recommended
                </span>
              )}
              {!isActive && (
                <span
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-mono-tag"
                  style={{
                    backgroundColor: 'var(--cream-row-even)',
                    color: 'var(--brown-soft)',
                  }}
                >
                  <Lock size={9} />
                  Coming soon
                </span>
              )}

              <h3
                className="text-body-sm font-semibold mb-1"
                style={{ color: 'var(--brown)' }}
              >
                {c.name}
              </h3>
              <p
                className="text-body-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: 'var(--brown-soft)' }}
              >
                {c.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
