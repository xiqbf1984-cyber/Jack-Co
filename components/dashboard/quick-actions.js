'use client';

import Link from 'next/link';
import { Plus, Trophy, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', icon: Plus, color: '#27825b', href: '/roles/create' },
  { label: 'Add a Candidate', icon: Users, color: '#0077B5', href: null },
  { label: 'Create an Assessment', icon: Trophy, color: '#8b6914', href: '/assessment/create' },
  { label: 'View Evaluation', icon: BarChart3, color: '#d4880f', href: '/evaluation' },
];

export default function QuickActions() {
  const openModal = useAppStore((s) => s.openAddCandidateModal);

  return (
    <div>
      <h3 className="text-display-section mb-3">Quick Actions</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <div
              className="surface-card surface-card-interactive flex flex-col items-center gap-2.5 text-center"
              style={{
                padding: '16px 12px',
                animation: `fsu 0.25s ease-out ${i * 0.05}s both`,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: action.color + '14' }}
              >
                <Icon size={16} style={{ color: action.color }} />
              </div>
              <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)', lineHeight: '1.3' }}>
                {action.label}
              </div>
            </div>
          );

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className="no-underline">
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
