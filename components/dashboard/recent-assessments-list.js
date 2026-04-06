'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const statusColors = {
  published: '#27825b',
  submitted: '#d4880f',
  draft: '#a09878',
  pending: '#d4880f',
};

export default function RecentAssessmentsList() {
  const challenges = useAppStore((s) => s.challenges);
  const display = challenges.slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-display-section">Recent Assessments</h3>
        <Link
          href="/assessment"
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
        {display.map((challenge, i) => (
          <Link
            key={challenge.id}
            href={`/assessment/${challenge.id}`}
            className="flex items-center justify-between border-b last:border-b-0 transition-colors hover-bg-cream-card-hover no-underline"
            style={{
              padding: 'var(--row-padding-y) var(--row-padding-x)',
              borderColor: 'var(--border-light)',
              backgroundColor: undefined,
              animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                {challenge.name}
              </span>
              <span className="text-body-xs" style={{ color: '#7a7068' }}>
                {challenge.roleTitle} &middot; {challenge.candIds?.length || 0} candidates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[challenge.status] || '#a09878' }}
              />
              <span className="text-mono-tag" style={{ color: statusColors[challenge.status] || 'var(--brown-soft)' }}>
                {challenge.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
