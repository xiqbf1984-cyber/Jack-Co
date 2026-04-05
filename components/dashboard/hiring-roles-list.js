'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const statusColors = {
  active: '#27825b',
  draft: '#c4b896',
  pending: '#d4880f',
};

export default function HiringRolesList() {
  const roles = useAppStore((s) => s.roles);
  const display = roles.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-display-section">Hiring Roles</h3>
        <Link
          href="/roles"
          className="text-body-xs no-underline flex items-center gap-1 hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div className="rounded-xl border overflow-hidden relative" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
        {display.map((role, i) => (
          <div
            key={role.id}
            className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
            style={{
              borderColor: 'var(--border-light)',
              backgroundColor: i % 2 === 1 ? 'var(--cream-row-even)' : undefined,
              animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                {role.title}
              </span>
              <span className="text-body-xs">{role.dept} &middot; {role.salary}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColors[role.status] || '#c4b896' }}
              />
              <span className="text-mono-tag" style={{ color: statusColors[role.status] || 'var(--brown-soft)' }}>
                {role.status}
              </span>
            </div>
          </div>
        ))}
        {/* Bottom fade overlay for 4th item */}
        {roles.length >= 4 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent, var(--cream-card))',
            }}
          />
        )}
      </div>
    </div>
  );
}
