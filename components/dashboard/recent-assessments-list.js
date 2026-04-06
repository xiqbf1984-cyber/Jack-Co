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
  const assessments = useAppStore((s) => s.assessments);
  const display = assessments.slice(0, 4);

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
        {display.map((assessment, i) => (
          <Link
            key={assessment.id}
            href={`/assessment/${assessment.id}`}
            className="flex items-center justify-between border-b last:border-b-0 transition-colors hover-bg-cream-card-hover no-underline"
            style={{
              padding: '12px 16px',
              borderColor: 'var(--border-light)',
              backgroundColor: undefined,
              animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                {assessment.name}
              </span>
              <span className="text-body-xs" style={{ color: '#7a7068' }}>
                {assessment.roleTitle} &middot; {assessment.candIds?.length || 0} candidates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[assessment.status] || '#a09878' }}
              />
              <span className="text-mono-tag" style={{ color: statusColors[assessment.status] || 'var(--brown-soft)' }}>
                {assessment.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
