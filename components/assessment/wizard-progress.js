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
                  'rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  isCompleted
                    ? 'w-6 h-6 bg-[var(--accent-green)] border-[var(--accent-green)] text-white'
                    : isCurrent
                      ? 'w-7 h-7 bg-[var(--gold)] border-[var(--gold)] text-white animate-glow'
                      : 'w-6 h-6 bg-[var(--cream)] border-[var(--border-default)]'
                )}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                ) : null}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] whitespace-nowrap font-mono uppercase tracking-wide',
                  isCompleted && 'text-[var(--accent-green)] font-semibold',
                  isCurrent && 'text-[var(--gold)] font-semibold',
                  !isCompleted && !isCurrent && 'text-[var(--brown-soft)]'
                )}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1.5 rounded-full transition-colors duration-300',
                  lineCompleted
                    ? 'bg-[var(--accent-green)]'
                    : 'bg-[var(--border-default)]'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
