'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', desc: 'Create a new job description', href: '/roles/create' },
  { label: 'Add an Assessment', desc: 'Design a work-sample assessment', href: '/assessment/create' },
  { label: 'Add Candidate', desc: 'Add to your candidate pool', href: null },
  { label: 'View Evaluations', desc: 'Check assessment results', href: '/evaluation' },
];

export default function QuickActions() {
  const openModal = useAppStore((s) => s.openAddCandidateModal);

  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--brown)',
        marginBottom: 10,
      }}>Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {actions.map((action, i) => {
          const inner = (
            <div
              key={action.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-default)',
                background: '#fff',
                cursor: 'pointer',
                animation: 'fsu .2s ease ' + (i * 0.04) + 's both',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}>{action.label}</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--brown-soft)',
                  marginTop: 1,
                  lineHeight: 1.4,
                }}>{action.desc}</div>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
            </div>
          );

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                {inner}
              </Link>
            );
          }

          return (
            <div key={action.label} onClick={openModal}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
