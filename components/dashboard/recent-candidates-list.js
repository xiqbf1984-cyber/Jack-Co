'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const statusColors = {
  active: '#27825b',
  completed: '#27825b',
  idle: '#c4b896',
  pending: '#d4880f',
};

export default function RecentCandidatesList() {
  const candidates = useAppStore((s) => s.candidates);
  const display = candidates.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-display-section">Recent Candidates</h3>
        <Link
          href="/candidates"
          className="text-body-xs no-underline flex items-center gap-1 hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div className="rounded-xl border overflow-hidden relative" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
        {display.map((cand, i) => (
          <div
            key={cand.id}
            className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
            style={{
              borderColor: 'var(--border-light)',
              backgroundColor: i % 2 === 1 ? 'var(--cream-row-even)' : undefined,
              animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono font-bold shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                  color: 'var(--brown)',
                }}
              >
                {cand.avatar}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                  {cand.name}
                </span>
                <span className="text-body-xs">{cand.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColors[cand.status] || '#c4b896' }}
              />
              <span className="text-mono-tag" style={{ color: statusColors[cand.status] || 'var(--brown-soft)' }}>
                {cand.status}
              </span>
            </div>
          </div>
        ))}
        {candidates.length >= 4 && (
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
