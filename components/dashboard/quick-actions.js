'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Trophy, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', desc: 'Create a new job description', icon: Briefcase, color: '#27825b', href: '/roles/create' },
  { label: 'Add a Challenge', desc: 'Design an assessment', icon: Trophy, color: 'var(--gold)', href: '/assessment/create' },
  { label: 'Add Candidate', desc: 'Add to your pool', icon: Users, color: '#0077B5', href: null },
  { label: 'View Evaluations', desc: 'Check assessment results', icon: BarChart3, color: '#d4880f', href: '/evaluation' },
];

export default function QuickActions() {
  const openModal = useAppStore((s) => s.openAddCandidateModal);

  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--brown)',
        marginBottom: 12,
      }}>Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <div
              key={action.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${action.color}33`,
                background: `${action.color}06`,
                cursor: 'pointer',
                animation: `fsu .2s ease ${i * 0.04}s both`,
                transition: 'box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 2px 8px ${action.color}18`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: `${action.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={14} style={{ color: action.color }} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  fontWeight: 600,
                }}>{action.label}</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--brown-soft)',
                  marginTop: 2,
                  lineHeight: 1.5,
                }}>{action.desc}</div>
              </div>
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
