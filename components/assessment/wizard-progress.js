'use client';

import { WIZARD_STEPS } from '@/lib/constants';
import { useAssessmentStore } from '@/stores/assessment-store';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function WizardProgress() {
  const currentStep = useAssessmentStore((s) => s.currentStep);
  const completedSteps = useAssessmentStore((s) => s.completedSteps);
  const maxReachedStep = useAssessmentStore((s) => s.maxReachedStep);
  const goToStep = useAssessmentStore((s) => s.goToStep);

  return (
    <div className="flex items-center w-full mx-auto" style={{ maxWidth: 720 }}>
      {WIZARD_STEPS.map((step, i) => {
        const isCompleted = completedSteps.includes(i);
        const isCurrent = currentStep === i;
        const isClickable = i <= maxReachedStep;
        const isLast = i === WIZARD_STEPS.length - 1;

        // Determine the line color (line AFTER this step)
        const lineCompleted = completedSteps.includes(i);

        return (
          <div
            key={step.id}
            className={cn('flex items-center', !isLast && 'flex-1')}
          >
            <button
              type="button"
              onClick={() => isClickable && goToStep(i)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-1 transition-all duration-200',
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
              )}
              title={step.label}
            >
              {/* Dot */}
              <div
                className={cn(
                  'app-progress-step-dot',
                  isCompleted && 'text-white',
                  isCurrent && 'text-white animate-glow',
                )}
                style={{
                  backgroundColor: isCompleted
                    ? 'var(--accent-green)'
                    : isCurrent
                      ? 'var(--gold)'
                      : 'var(--cream)',
                  border: isCompleted
                    ? '2px solid var(--accent-green)'
                    : isCurrent
                      ? '2px solid var(--gold)'
                      : '2px solid var(--border-default)',
                }}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                ) : null}
              </div>

              {/* Label */}
              <span
                className="app-progress-step-label"
                style={{
                  color: isCompleted
                    ? 'var(--accent-green)'
                    : isCurrent
                      ? 'var(--gold)'
                      : 'var(--brown-soft)',
                  fontWeight: (isCompleted || isCurrent) ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                className="flex-1 mx-1.5 rounded-full transition-colors duration-300"
                style={{
                  height: 2,
                  backgroundColor: lineCompleted
                    ? 'var(--accent-green)'
                    : 'var(--border-default)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
