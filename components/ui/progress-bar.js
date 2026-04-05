'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

function ProgressBar({ steps = [], currentStep, completedSteps = [], onStepClick }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isLast = i === steps.length - 1;

        let status = 'locked';
        if (isCompleted) status = 'done';
        else if (isCurrent) status = 'active';

        const statusStyles = {
          done: {
            dotBg: 'var(--accent-green)',
            dotBorder: 'var(--accent-green)',
            textColor: 'var(--accent-green)',
            textWeight: 400,
            lineBg: 'var(--accent-green)',
          },
          active: {
            dotBg: 'var(--gold)',
            dotBorder: 'var(--gold)',
            textColor: 'var(--gold)',
            textWeight: 600,
            lineBg: 'var(--border-default)',
          },
          locked: {
            dotBg: 'var(--cream)',
            dotBorder: 'var(--border-default)',
            textColor: 'var(--brown-soft)',
            textWeight: 400,
            lineBg: 'var(--border-default)',
          },
        };

        const s = statusStyles[status];

        return (
          <div
            key={step.id}
            className={cn('flex items-center', !isLast && 'flex-1')}
          >
            {/* Step dot + label */}
            <button
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={cn(
                'flex flex-col items-center gap-1.5',
                onStepClick ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: s.dotBg,
                  border: `2px solid ${s.dotBorder}`,
                  color: status !== 'locked' ? 'white' : undefined,
                }}
              >
                {isCompleted ? (
                  <Check size={12} />
                ) : (
                  <span className="text-xs font-semibold">
                    {isCurrent ? i + 1 : ''}
                  </span>
                )}
              </div>
              <span
                className="text-xs whitespace-nowrap"
                style={{ color: s.textColor, fontWeight: s.textWeight }}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                className="flex-1 mx-2 rounded-full"
                style={{ height: 2, backgroundColor: s.lineBg }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ProgressBar };
