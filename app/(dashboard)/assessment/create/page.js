'use client';

import { useAssessmentStore } from '@/stores/assessment-store';
import WizardProgress from '@/components/assessment/wizard-progress';
import LivePreview from '@/components/assessment/live-preview';
import StepRole from '@/components/assessment/step-role';
import StepCluster from '@/components/assessment/step-cluster';
import StepPathway from '@/components/assessment/step-pathway';
import StepTask from '@/components/assessment/step-task';
import StepContext from '@/components/assessment/step-context';
import StepEnvironment from '@/components/assessment/step-environment';
import StepCandidates from '@/components/assessment/step-candidates';
import StepReview from '@/components/assessment/step-review';
import { ArrowLeft } from 'lucide-react';

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
  const goToStep = useAssessmentStore((s) => s.goToStep);
  const StepComponent = STEP_COMPONENTS[currentStep] || StepRole;

  const showBack = currentStep >= 1 && currentStep <= 6;

  return (
    <div style={{
      display: 'flex',
      margin: '-32px -32px -64px -32px',
      height: 'calc(100vh)',
    }}>
      {/* Left: Operations Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Sticky progress bar */}
        <div style={{
          flexShrink: 0,
          backgroundColor: 'var(--cream)',
          padding: '14px 32px 10px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <WizardProgress />
        </div>

        {/* Scrollable step content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 32px 80px',
        }}>
          <div style={{ maxWidth: 560 }}>
            {/* Back button */}
            {showBack && (
              <button
                onClick={() => goToStep(currentStep - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--gold)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: 16,
                }}
              >
                <ArrowLeft size={12} />
                Back
              </button>
            )}

            <StepComponent key={currentStep} />
          </div>
        </div>
      </div>

      {/* Right: Live Preview — single instance */}
      <div style={{
        width: 300,
        flexShrink: 0,
        borderLeft: '1px solid var(--border-default)',
        backgroundColor: '#fff',
        overflowY: 'auto',
      }}>
        <LivePreview />
      </div>
    </div>
  );
}
