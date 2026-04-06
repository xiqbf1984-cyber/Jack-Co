'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { X } from 'lucide-react';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AddCandidateModal() {
  const open = useAppStore((s) => s.addCandidateModalOpen);
  const close = useAppStore((s) => s.closeAddCandidateModal);
  const addCandidate = useAppStore((s) => s.addCandidate);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const emailInvalid = emailTouched && email.length > 0 && !isValidEmail(email);
  const canSubmit = name.trim().length > 0 && isValidEmail(email);

  const handleClose = useCallback(() => {
    setName('');
    setEmail('');
    setEmailTouched(false);
    close();
  }, [close]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    addCandidate({
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      status: 'idle',
      tz: 'UTC',
      avatar: initials,
    });
    handleClose();
  }, [canSubmit, name, email, addCandidate, handleClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Enter' && canSubmit) handleSubmit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, canSubmit, handleClose, handleSubmit]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(26,22,18,0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fi .15s ease both',
      }} />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: 400,
          background: '#fff',
          borderRadius: 18,
          padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,.15)',
          animation: 'fadeScale .2s ease both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brown-soft)',
          }}
        >
          <X size={16} />
        </button>

        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--brown)',
          marginBottom: 4,
        }}>Add Candidate</h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown-soft)',
          marginBottom: 20,
          lineHeight: 1.5,
        }}>Add a new candidate to your organization. They will be available to invite to trials.</p>

        {/* Name */}
        <div style={{ marginBottom: 18 }}>
          <label style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brown)',
            display: 'block',
            marginBottom: 8,
          }}>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: 'var(--cream)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--border-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brown)',
            display: 'block',
            marginBottom: 8,
          }}>Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (!emailTouched) setEmailTouched(true); }}
            onBlur={() => setEmailTouched(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid ${emailInvalid ? 'var(--red)' : 'var(--border-default)'}`,
              background: 'var(--cream)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { if (!emailInvalid) e.target.style.borderColor = 'var(--border-hover)'; }}
          />
          {emailInvalid && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--red)',
              marginTop: 4,
            }}>Invalid email format</div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: canSubmit
                ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                : '#a0968c',
              color: 'var(--btn-text)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5,
              boxShadow: canSubmit ? '0 4px 12px rgba(92,82,72,0.18)' : 'none',
            }}
          >Add Candidate</button>
        </div>
      </div>
    </div>
  );
}
