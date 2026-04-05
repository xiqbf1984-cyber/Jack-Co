'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const statusColors = {
  active: '#27825b',
  draft: '#a09878',
  pending: '#d4880f',
};

export default function HiringRolesList() {
  const roles = useAppStore((s) => s.roles);
  const display = roles.slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-display-section">Hiring Roles</h3>
        <Link
          href="/roles"
          className="text-body-sm font-semibold no-underline flex items-center gap-1 hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div
        className="rounded-xl border overflow-hidden relative flex-1"
        style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card)' }}
      >
        {display.map((role, i) => (
          <div
            key={role.id}
            className="flex items-center justify-between border-b last:border-b-0 transition-colors hover-bg-cream-card-hover"
            style={{
              padding: '16px 20px',
              borderColor: 'var(--border-light)',
              backgroundColor: i % 2 === 1 ? 'var(--cream-row-even)' : undefined,
              animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                {role.title}
              </span>
              <span className="text-body-xs" style={{ color: '#7a7068' }}>
                {role.dept} &middot; {role.salary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[role.status] || '#a09878' }}
              />
              <span className="text-mono-tag" style={{ color: statusColors[role.status] || 'var(--brown-soft)' }}>
                {role.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
