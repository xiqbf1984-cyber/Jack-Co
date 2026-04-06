'use client';

import { WIZARD_STEPS } from '@/lib/constants';
import { useAssessmentStore } from '@/stores/assessment-store';

export default function WizardProgress() {
  const currentStep = useAssessmentStore((s) => s.currentStep);
  const completedSteps = useAssessmentStore((s) => s.completedSteps);
  const maxReachedStep = useAssessmentStore((s) => s.maxReachedStep);
  const goToStep = useAssessmentStore((s) => s.goToStep);

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {WIZARD_STEPS.map((step, i) => {
        const isCompleted = completedSteps.includes(i);
        const isCurrent = currentStep === i;
        const isClickable = isCompleted;

        let barColor = 'var(--border-default)';
        let labelColor = 'var(--border-default)';

        if (isCompleted) {
          barColor = 'var(--accent-green)';
          labelColor = 'var(--accent-green)';
        } else if (isCurrent) {
          barColor = 'var(--gold)';
          labelColor = 'var(--gold)';
        }

        return (
          <div
            key={step.id}
            style={{
              flex: 1,
              cursor: isClickable ? 'pointer' : 'default',
            }}
            onClick={() => isClickable && goToStep(i)}
          >
            {/* Color bar */}
            <div style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: barColor,
              transition: 'background-color 0.2s ease',
            }} />
            {/* Label */}
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              marginTop: 5,
              textAlign: 'center',
              color: labelColor,
              transition: 'color 0.2s ease',
              userSelect: 'none',
            }}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
