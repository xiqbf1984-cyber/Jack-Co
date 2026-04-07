'use client';

import { useEffect } from 'react';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600,
        color: 'var(--brown)',
      }}>
        Something went wrong
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
        maxWidth: 360, textAlign: 'center', lineHeight: 1.5,
      }}>
        An unexpected error occurred. Please try again.
      </div>
      <button
        onClick={reset}
        className="btn-primary"
        style={{ padding: '8px 20px', fontSize: 12 }}
      >
        Try Again
      </button>
    </div>
  );
}
