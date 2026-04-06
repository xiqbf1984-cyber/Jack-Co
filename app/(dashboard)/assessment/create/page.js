'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

var STEP_COMPONENTS = [
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
  var currentStep = useAssessmentStore(function (s) { return s.currentStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var StepComponent = STEP_COMPONENTS[currentStep] || StepRole;

  var showBack = currentStep >= 1 && currentStep <= 6;

  return (
    <div style={{ display: 'flex', margin: '-32px -32px -64px -32px', height: '100vh' }}>
      {/* Left: Operations Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header + Progress */}
        <div style={{ flexShrink: 0, backgroundColor: 'var(--cream)' }}>
          {/* Back + Title */}
          <div style={{ padding: '14px 24px 0' }}>
            <Link href="/assessment" style={{
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)',
              fontSize: 12, color: 'var(--brown-soft)', textDecoration: 'none', marginBottom: 10,
            }}>
              <ArrowLeft size={13} />
              Back to Assessments
            </Link>
            <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)', marginBottom: 2 }}>Create Assessment</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 12 }}>Set up a new assessment to evaluate candidates</p>
          </div>

          {/* Progress bar */}
          <div style={{ padding: '0 24px 8px', borderBottom: '1px solid var(--border-default)' }}>
            <WizardProgress />
          </div>
        </div>

        {/* Scrollable step content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 560, padding: '20px 24px 80px' }}>
            {/* Back button within steps */}
            {showBack && (
              <button
                onClick={function () { goToStep(currentStep - 1); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)',
                  fontSize: 11, color: 'var(--gold)', background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, marginBottom: 16,
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

      {/* Right: Live Preview */}
      <div style={{
        width: 280, flexShrink: 0, borderLeft: '1px solid var(--border-default)',
        backgroundColor: '#fff', overflowY: 'auto',
      }}>
        <LivePreview />
      </div>
    </div>
  );
}
