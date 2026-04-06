'use client';

import LivePreview from '@/components/assessment/live-preview';

export default function CreateAssessmentLayout({ children }) {
  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Center: wizard content area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ minWidth: 500 }}
      >
        {children}
      </div>

      {/* Right: Live Preview panel */}
      <div
        className="overflow-y-auto shrink-0 hidden lg:block"
        style={{
          width: 380,
          borderLeft: '1px solid var(--border-light)',
          backgroundColor: 'var(--cream-card)',
        }}
      >
        <LivePreview />
      </div>
    </div>
  );
}
