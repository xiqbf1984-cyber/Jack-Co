'use client';

import Link from 'next/link';
import { CheckCircle, Trophy, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function RoleComplete({ roleTitle = 'New Role' }) {
  const actions = [
    {
      label: 'Create Assessment',
      description: 'Design a skills assessment for this role',
      href: '/assessment/create',
      icon: Trophy,
      primary: true,
    },
    {
      label: 'Create Another Role',
      description: 'Start a new role creation flow',
      href: '/roles/create',
      icon: PlusCircle,
      primary: false,
    },
    {
      label: 'Go to Dashboard',
      description: 'Return to the main dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      primary: false,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-16 animate-fsu">
      {/* Success icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(39, 130, 91, 0.1)' }}
      >
        <CheckCircle size={32} style={{ color: 'var(--accent-green)' }} />
      </div>

      {/* Title */}
      <h1 className="text-display-page mb-2">Role saved successfully</h1>
      <p className="text-body-lg mb-10" style={{ color: 'var(--brown-muted)' }}>{roleTitle}</p>

      {/* Action cards */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.primary
                  ? 'btn-primary w-full py-4 px-5 text-left flex items-center gap-4 rounded-xl'
                  : 'btn-secondary w-full py-4 px-5 text-left flex items-center gap-4 rounded-xl'
              }
            >
              <Icon size={20} />
              <div>
                <div className="font-semibold text-body-sm">{action.label}</div>
                <div
                  className="text-body-xs mt-0.5"
                  style={{
                    color: action.primary ? 'rgba(251,249,244,0.7)' : 'var(--brown-muted)',
                  }}
                >
                  {action.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
