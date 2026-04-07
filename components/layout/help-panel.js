'use client';

import { useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import { X, HelpCircle, BookOpen, MessageCircle, Lightbulb, Keyboard, ExternalLink } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], desc: 'Open command palette' },
  { keys: ['⌘', '\\'], desc: 'Toggle sidebar' },
  { keys: ['G', 'D'], desc: 'Go to Dashboard' },
  { keys: ['G', 'R'], desc: 'Go to Roles' },
  { keys: ['G', 'C'], desc: 'Go to Candidates' },
  { keys: ['C', 'R'], desc: 'Create Role' },
  { keys: ['C', 'A'], desc: 'Create Assessment' },
];

const FAQ = [
  { q: 'How do I create a job description?', a: 'Go to Roles → Add Role and describe the position. Our AI assistant will help you refine it and generate a professional JD.' },
  { q: 'How do assessments work?', a: 'Assessments are work-sample tests linked to specific roles. Create one from the Assessments page with our 8-step wizard.' },
  { q: 'Can I invite candidates directly?', a: 'Yes! Add candidates from the Candidates page and they will receive email invitations to complete assessments.' },
  { q: 'How is scoring done?', a: 'Assessments are scored on multiple rubric dimensions. View results in the Evaluation section.' },
];

export default function HelpPanel({ open, onClose }) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: sidebarWidth + 8,
        bottom: 60,
        width: 380,
        maxHeight: '70vh',
        transition: 'left 0.2s ease',
        backgroundColor: '#fff',
        borderRadius: 14,
        boxShadow: 'var(--shadow-modal)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeScale .15s ease both',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={15} style={{ color: 'var(--brown)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Help & Support
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4,
            color: 'var(--brown-soft)',
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Quick links */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            Quick Links
          </div>
          {[
            { icon: BookOpen, label: 'Documentation', desc: 'Learn how to use NeoHuman' },
            { icon: MessageCircle, label: 'Contact Support', desc: 'Get help from our team' },
            { icon: Lightbulb, label: 'Feature Request', desc: 'Suggest improvements' },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
                  borderRadius: 8, cursor: 'pointer', transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  backgroundColor: 'rgba(139,105,20,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} style={{ color: 'var(--gold)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>
                    {link.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 1 }}>
                    {link.desc}
                  </div>
                </div>
                <ExternalLink size={12} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>

        <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '0 16px' }} />

        {/* Keyboard shortcuts */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            <Keyboard size={12} />
            Keyboard Shortcuts
          </div>
          {SHORTCUTS.map((sc, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>
                {sc.desc}
              </span>
              <div style={{ display: 'flex', gap: 3 }}>
                {sc.keys.map((key, ki) => (
                  <span key={ki} style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    color: 'var(--brown-soft)', backgroundColor: 'var(--cream)',
                    padding: '2px 6px', borderRadius: 3,
                    border: '1px solid var(--border-light)', minWidth: 18, textAlign: 'center',
                  }}>
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '0 16px' }} />

        {/* FAQ */}
        <div style={{ padding: '12px 16px 20px' }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            Frequently Asked Questions
          </div>
          {FAQ.map((item, i) => (
            <div key={i} style={{ padding: '8px 10px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', lineHeight: 1.3 }}>
                {item.q}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 4, lineHeight: 1.5 }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--border-light)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-light)',
        textAlign: 'center',
      }}>
        NeoHuman v1.0.0
      </div>
    </div>
  );
}
