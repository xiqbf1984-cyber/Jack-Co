'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Trophy, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', desc: 'Create a new job description', icon: Briefcase, color: '#27825b', href: '/roles/create' },
  { label: 'Add an Assessment', desc: 'Design an assessment', icon: Trophy, color: '#8b6914', href: '/assessment/create' },
  { label: 'Add Candidate', desc: 'Add to your pool', icon: Users, color: '#0077B5', href: null },
  { label: 'View Evaluations', desc: 'Check assessment results', icon: BarChart3, color: '#d4880f', href: '/evaluation' },
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
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid ' + action.color + '28',
                background: action.color + '08',
                cursor: 'pointer',
                animation: 'fsu .2s ease ' + (i * 0.04) + 's both',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px ' + action.color + '18';
                e.currentTarget.style.borderColor = action.color + '40';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = action.color + '28';
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: action.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={13} style={{ color: action.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
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
