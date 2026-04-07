'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessment-store';
import WizardProgress from '@/components/assessment/wizard-progress';
import StepRole from '@/components/assessment/step-role';
import StepTask from '@/components/assessment/step-task';
import StepContext from '@/components/assessment/step-context';
import StepEnvironment from '@/components/assessment/step-environment';
import StepCandidates from '@/components/assessment/step-candidates';
import StepReview from '@/components/assessment/step-review';

// 7-step flow: Role → Task → Problem → Environment → Rubrics → Candidates → Review
var STEP_COMPONENTS = [
  StepRole,       // 0
  StepTask,       // 1
  StepContext,    // 2 (Problem)
  StepEnvironment,// 3
  null,           // 4 (Rubrics - placeholder, uses StepReview for now)
  StepCandidates, // 5
  StepReview,     // 6
];

export default function CreateAssessmentPage() {
  var currentStep = useAssessmentStore(function (s) { return s.currentStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var StepComponent = STEP_COMPONENTS[currentStep] || StepRole;

  // Rubrics placeholder — show a simple rubrics config for now
  if (currentStep === 4 && !StepComponent) {
    StepComponent = RubricsPlaceholder;
  }

  var showBack = currentStep >= 1;
  var [headerEl, setHeaderEl] = useState(null);

  useEffect(function () {
    var h = document.getElementById('assessment-header-area');
    if (h) setHeaderEl(h);
  }, []);

  return (
    <>
      {/* Header */}
      {headerEl && createPortal(
        <div style={{ flexShrink: 0, backgroundColor: 'var(--cream)' }}>
          <div style={{ padding: '14px 32px 0' }}>
            <Link href="/assessment" style={{
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)',
              fontSize: 12, color: 'var(--brown-soft)', textDecoration: 'none', marginBottom: 10,
            }}>
              <ArrowLeft size={13} /> Back to Assessments
            </Link>
            <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)', marginBottom: 2 }}>
              Create Assessment
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 12 }}>
              Set up a new assessment to evaluate candidates
            </p>
          </div>
          <div style={{ padding: '0 32px 8px', borderBottom: '1px solid var(--border-default)' }}>
            <WizardProgress />
          </div>
        </div>,
        headerEl
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 32px 80px' }}>
          {showBack && (
            <button
              onClick={function () { goToStep(currentStep - 1); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)',
                fontSize: 11, color: 'var(--brown-soft)', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0, marginBottom: 16,
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
          )}
          <StepComponent key={currentStep} />
        </div>
      </div>
    </>
  );
}

// Simple rubrics placeholder step
function RubricsPlaceholder() {
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Evaluation Rubrics
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Define how candidates will be scored on this assessment
        </p>
      </div>

      <div style={{
        borderRadius: 12, border: '1px solid var(--border-default)',
        background: '#fff', padding: '32px 24px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>
          Auto-generated rubrics
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 20, lineHeight: 1.5, maxWidth: 360, margin: '0 auto 20px' }}>
          Rubrics will be automatically generated based on your role, task, and problem definition. You can review and customize them before launching.
        </div>
        <button
          onClick={function () { completeStep(4); goToStep(5); }}
          className="btn-primary"
          style={{ padding: '9px 24px', fontSize: 13 }}
        >
          Continue to Candidates
        </button>
      </div>
    </div>
  );
}
