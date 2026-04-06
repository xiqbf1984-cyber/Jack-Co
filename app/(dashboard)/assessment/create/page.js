'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import WizardProgress from '@/components/assessment/wizard-progress';
import StepRole from '@/components/assessment/step-role';
import StepCluster from '@/components/assessment/step-cluster';
import StepPathway from '@/components/assessment/step-pathway';
import StepTask from '@/components/assessment/step-task';
import StepContext from '@/components/assessment/step-context';
import StepEnvironment from '@/components/assessment/step-environment';
import StepCandidates from '@/components/assessment/step-candidates';
import StepReview from '@/components/assessment/step-review';

const STEP_COMPONENTS = [
  StepRole,
  StepCluster,
  StepPathway,
  StepTask,
  StepContext,
  StepEnvironment,
  StepCandidates,
  StepReview,
];

export default function CreateAssessmentPage() {
  const currentStep = useAssessmentStore((s) => s.currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep] || StepRole;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky wizard progress bar */}
      <div
        className="sticky top-0 z-10 px-8 py-4"
        style={{
          backgroundColor: 'var(--cream)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <WizardProgress />
      </div>

      {/* Current step content */}
      <div className="flex-1 animate-fsu" style={{ padding: 'var(--page-padding-x) var(--space-12)' }}>
        <StepComponent key={currentStep} />
      </div>
    </div>
  );
}
