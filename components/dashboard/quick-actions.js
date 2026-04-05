'use client';

import Link from 'next/link';
import { Plus, Trophy, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', subtitle: 'Create a new hiring position', icon: Plus, color: '#27825b', href: '/roles/create' },
  { label: 'New Assessment', subtitle: 'Design an AI assessment', icon: Trophy, color: '#8b6914', href: '/assessment/create' },
  { label: 'Add Candidate', subtitle: 'Invite to your pool', icon: Users, color: '#0077B5', href: null },
  { label: 'View Evaluations', subtitle: 'Scores and feedback', icon: BarChart3, color: '#d4880f', href: '/evaluation' },
];

export default function QuickActions() {
  const openModal = useAppStore((s) => s.openAddCandidateModal);

  return (
    <div>
      <h3 className="text-display-section mb-4">Quick Actions</h3>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <div
              className="flex items-center gap-3.5 p-5 rounded-xl border transition-all duration-200 cursor-pointer hover-shadow-card"
              style={{
                backgroundColor: 'var(--cream-card)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card)',
                animation: `fsu 0.25s ease-out ${i * 0.05}s both`,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: action.color + '18' }}
              >
                <Icon size={16} style={{ color: action.color }} />
              </div>
              <div>
                <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{action.label}</div>
                <div className="text-body-xs" style={{ color: 'var(--brown-muted)' }}>{action.subtitle}</div>
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
