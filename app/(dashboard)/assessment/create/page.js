'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

// New step order: Role → Task → Problem → Environment → Candidates → Review
// (Industry/Roles steps only show if user creates new role without existing JD)
var STEP_COMPONENTS = [
  StepRole,       // 0 - Select existing role or create new
  StepCluster,    // 1 - Industry (skipped if existing role selected)
  StepPathway,    // 2 - Roles (skipped if existing role selected)
  StepTask,       // 3 - Task marketplace
  StepContext,    // 4 - Define the Problem
  StepEnvironment,// 5 - Configure Environment
  StepCandidates, // 6 - Add Candidates
  StepReview,     // 7 - Review & Launch
];

export default function CreateAssessmentPage() {
  var currentStep = useAssessmentStore(function (s) { return s.currentStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var StepComponent = STEP_COMPONENTS[currentStep] || StepRole;

  var showBack = currentStep >= 1;

  var [headerEl, setHeaderEl] = useState(null);

  useEffect(function () {
    var h = document.getElementById('assessment-header-area');
    if (h) setHeaderEl(h);
  }, []);

  // Skip Industry/Roles steps if user selected an existing role
  var handleBack = function () {
    if (currentStep === 3 && role.parsedFrom === 'existing-role') {
      // Jump back to Role selection, skipping Industry/Roles
      goToStep(0);
    } else {
      goToStep(currentStep - 1);
    }
  };

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
              <ArrowLeft size={13} />
              Back to Assessments
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

      {/* Full-width centered content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 32px 80px' }}>
          {showBack && (
            <button
              onClick={handleBack}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)',
                fontSize: 11, color: 'var(--brown-soft)', background: 'none', border: 'none',
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
    </>
  );
}
