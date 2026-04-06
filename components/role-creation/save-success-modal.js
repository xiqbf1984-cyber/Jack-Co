'use client';

import { ArrowRight } from 'lucide-react';

export default function SaveSuccessModal({ roleTitle, onCreateAnother, onGoToAssessment, onStay }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(26,22,18,0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '36px 32px 28px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,.15)',
        animation: 'fadeScale 0.3s ease both',
      }}>
        {/* Success icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'rgba(39, 130, 91, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--brown)',
          textAlign: 'center',
          marginBottom: 6,
        }}>
          Role Created
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-soft)',
          textAlign: 'center',
          marginBottom: 28,
          lineHeight: 1.5,
        }}>
          <strong style={{ color: 'var(--brown)' }}>{roleTitle}</strong> has been saved successfully. What would you like to do next?
        </p>

        {/* Action options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Create assessment */}
          <button
            type="button"
            onClick={onGoToAssessment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 18px',
              borderRadius: 14,
              border: '1.5px solid rgba(39, 130, 91, 0.25)',
              backgroundColor: 'rgba(39, 130, 91, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left',
            }}
            onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'rgba(39, 130, 91, 0.08)'; }}
            onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'rgba(39, 130, 91, 0.04)'; }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                Create an Assessment
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)', marginTop: 2 }}>
                Set up an AI assessment for this role
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
          </button>

          {/* Create another role */}
          <button
            type="button"
            onClick={onCreateAnother}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 18px',
              borderRadius: 14,
              border: '1.5px solid rgba(139, 105, 20, 0.2)',
              backgroundColor: 'rgba(139, 105, 20, 0.03)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left',
            }}
            onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'rgba(139, 105, 20, 0.07)'; }}
            onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'rgba(139, 105, 20, 0.03)'; }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                Create Another Role
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)', marginTop: 2 }}>
                Start a new JD from scratch
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
          </button>
        </div>

        {/* Stay link */}
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button
            type="button"
            onClick={onStay}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={function (e) { e.currentTarget.style.color = 'var(--brown)'; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = 'var(--brown-muted)'; }}
          >
            Stay and keep editing
          </button>
        </div>
      </div>
    </div>
  );
}
