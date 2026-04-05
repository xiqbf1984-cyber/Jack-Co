'use client';

import Link from 'next/link';
import { Plus, Trophy, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const actions = [
  { label: 'Add a Role', icon: Plus, color: '#27825b', href: '/roles/create' },
  { label: 'Add a Challenge', icon: Trophy, color: '#8b6914', href: '/challenges/create' },
  { label: 'Add Candidate', icon: Users, color: '#0077B5', href: null },
  { label: 'View Evaluations', icon: BarChart3, color: '#d4880f', href: '/evaluation' },
];

export default function QuickActions() {
  const openModal = useAppStore((s) => s.openAddCandidateModal);

  return (
    <div>
      <h3 className="text-display-section mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,.07)]"
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
              <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                {action.label}
              </span>
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
