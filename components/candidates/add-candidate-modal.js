'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { TIMEZONES } from '@/lib/constants';
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
  const [timezone, setTimezone] = useState('');
  const [notes, setNotes] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailInvalid = emailTouched && email.length > 0 && !isValidEmail(email);
  const canSubmit = name.trim().length > 0 && isValidEmail(email) && !submitting;

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setTimezone('');
    setNotes('');
    setEmailTouched(false);
    setSubmitting(false);
    setSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    close();
  }, [close, resetForm]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    setSubmitting(true);

    // Simulate a brief save delay
    setTimeout(() => {
      const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
      const tz = timezone || 'UTC';
      const tzShort = TIMEZONES.find((t) => t.value === tz)?.short || tz;

      addCandidate({
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        status: 'idle',
        tz: tzShort,
        avatar: initials,
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        notes: notes.trim() || undefined,
      });

      setSubmitting(false);
      setSuccess(true);

      // Auto-close after showing success
      setTimeout(() => {
        handleClose();
      }, 1200);
    }, 400);
  }, [canSubmit, name, email, timezone, notes, addCandidate, handleClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Enter' && canSubmit && !success) handleSubmit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, canSubmit, success, handleClose, handleSubmit]);

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
          width: 440,
          background: '#fff',
          borderRadius: 18,
          padding: '32px 32px 24px',
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

        {/* Success state */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fsu .2s ease' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: 'rgba(39,130,91,0.1)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--brown)', marginBottom: 4 }}>
              Candidate Added
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>
              {name} has been added to your pool.
            </p>
          </div>
        ) : (
          <>
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
            }}>Add a new candidate to your organization. They will be available to invite to assessments.</p>

            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                  color: 'var(--brown)', display: 'block', marginBottom: 6,
                }}>Name <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: '1px solid var(--border-default)', background: 'var(--cream)',
                    fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--border-hover)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
                />
              </div>
              <div>
                <label style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                  color: 'var(--brown)', display: 'block', marginBottom: 6,
                }}>Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (!emailTouched) setEmailTouched(true); }}
                  onBlur={() => setEmailTouched(true)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: `1px solid ${emailInvalid ? 'var(--red)' : 'var(--border-default)'}`,
                    background: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 12,
                    color: 'var(--brown)', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { if (!emailInvalid) e.target.style.borderColor = 'var(--border-hover)'; }}
                />
                {emailInvalid && (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--red)', marginTop: 4 }}>
                    Invalid email format
                  </div>
                )}
              </div>
            </div>

            {/* Timezone */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--brown)', display: 'block', marginBottom: 6,
              }}>Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid var(--border-default)', background: 'var(--cream)',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
                  outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
                }}
              >
                <option value="">Select timezone (optional)</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.flag} {tz.label}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--brown)', display: 'block', marginBottom: 6,
              }}>Notes</label>
              <textarea
                placeholder="Any notes about this candidate (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid var(--border-default)', background: 'var(--cream)',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
                  outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--border-hover)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 20px', borderRadius: 8,
                  border: '1px solid var(--border-default)', background: '#fff',
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                  color: 'var(--brown)', cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: canSubmit
                    ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                    : '#a0968c',
                  color: 'var(--btn-text)', fontFamily: 'var(--font-body)', fontSize: 12,
                  fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed',
                  opacity: canSubmit ? 1 : 0.5,
                  boxShadow: canSubmit ? '0 4px 12px rgba(92,82,72,0.18)' : 'none',
                  minWidth: 120,
                }}
              >{submitting ? 'Adding...' : 'Add Candidate'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
