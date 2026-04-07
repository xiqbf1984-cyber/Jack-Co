'use client';

import { ArrowRight } from 'lucide-react';

export default function SaveSuccessModal({ roleTitle, onCreateAnother, onGoToAssessment, onStay }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(26,22,18,0.35)',
      backdropFilter: 'blur(8px)',
      animation: 'fi 0.15s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: '32px 28px 24px',
        width: '100%', maxWidth: 380,
        boxShadow: 'var(--shadow-modal)',
        animation: 'fadeScale 0.2s ease both',
        textAlign: 'center',
      }}>
        {/* Check icon */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          backgroundColor: 'rgba(39, 130, 91, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 600,
          color: 'var(--brown)', marginBottom: 4,
        }}>
          {roleTitle} saved
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
          marginBottom: 20,
        }}>
          What's next?
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={onGoToAssessment} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10,
            border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
            color: 'var(--brown)', cursor: 'pointer',
            transition: 'background-color 0.1s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            Create Assessment
            <ArrowRight size={14} style={{ color: 'var(--brown-light)' }} />
          </button>

          <button onClick={onCreateAnother} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10,
            border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
            color: 'var(--brown)', cursor: 'pointer',
            transition: 'background-color 0.1s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            Create Another Role
            <ArrowRight size={14} style={{ color: 'var(--brown-light)' }} />
          </button>
        </div>

        <button onClick={onStay} style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)',
          background: 'none', border: 'none', cursor: 'pointer',
          marginTop: 14, padding: '4px 8px',
        }}>
          Keep editing
        </button>
      </div>
    </div>
  );
}
