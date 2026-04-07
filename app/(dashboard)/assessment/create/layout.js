'use client';

export default function CreateAssessmentLayout({ children }) {
  return (
    <div
      style={{
        margin: '-32px -32px -64px -32px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--cream)',
        overflow: 'hidden',
      }}
    >
      {/* Header area – rendered by page.js via portal */}
      <div id="assessment-header-area" />

      {/* Full-width content area */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
