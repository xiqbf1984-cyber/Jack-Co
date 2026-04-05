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

        const colors = {
          done: {
            dot: 'bg-[var(--accent-green)] border-[var(--accent-green)]',
            text: 'text-[var(--accent-green)]',
            line: 'bg-[var(--accent-green)]',
          },
          active: {
            dot: 'bg-[var(--gold)] border-[var(--gold)]',
            text: 'text-[var(--gold)] font-semibold',
            line: 'bg-[var(--border-default)]',
          },
          locked: {
            dot: 'bg-[var(--cream)] border-[var(--border-default)]',
            text: 'text-[var(--brown-soft)]',
            line: 'bg-[var(--border-default)]',
          },
        };

        const c = colors[status];

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
                'flex flex-col items-center gap-1.5 cursor-pointer group',
                !onStepClick && 'cursor-default'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  c.dot,
                  status !== 'locked' && 'text-white'
                )}
              >
                {isCompleted ? (
                  <Check size={12} />
                ) : (
                  <span className="text-[10px] font-semibold">
                    {isCurrent ? i + 1 : ''}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] whitespace-nowrap', c.text)}>
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn('flex-1 h-0.5 mx-2 rounded-full', c.line)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ProgressBar };
