'use client';

import Link from 'next/link';
import { Briefcase, Trophy, UserPlus, BarChart3, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', desc: 'Create a new job description', href: '/roles/create', icon: Briefcase, color: 'var(--gold)', bg: 'rgba(139,105,20,0.1)' },
  { label: 'Add an Assessment', desc: 'Design a work-sample assessment', href: '/assessment/create', icon: Trophy, color: 'var(--accent-green)', bg: 'rgba(39,130,91,0.1)' },
  { label: 'Add Candidate', desc: 'Add to your candidate pool', href: null, icon: UserPlus, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { label: 'View Evaluations', desc: 'Check assessment results', href: '/evaluation', icon: BarChart3, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <div
              key={action.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid var(--border-default)',
                background: '#fff',
                cursor: 'pointer',
                animation: 'fsu .2s ease ' + (i * 0.04) + 's both',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                backgroundColor: action.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} style={{ color: action.color }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}>{action.label}</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--brown-soft)',
                  marginTop: 2,
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
