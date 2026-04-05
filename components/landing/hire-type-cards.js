'use client';

import Link from 'next/link';
import { Users, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const cardBase = cn(
  'relative flex flex-col items-center gap-4 p-8',
  'border',
  'transition-all duration-200'
);

export default function HireTypeCards() {
  return (
    <div className="flex flex-row items-stretch justify-center gap-6">
      {/* Hiring Human - clickable */}
      <Link href="/dashboard" className="no-underline">
        <div
          className={cn(
            cardBase,
            'cursor-pointer hover-scale-sm'
          )}
          style={{
            width: 280,
            backgroundColor: 'var(--cream-card)',
            borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--cream)] border border-[var(--border-light)]">
            <Users size={22} className="text-[var(--brown)]" />
          </div>
          <span className="font-display text-lg font-medium text-[var(--brown)]">
            Hiring Human
          </span>
          <span className="text-body-sm text-center text-[var(--brown-muted)]">
            Post trials and evaluate real candidates
          </span>
        </div>
      </Link>

      {/* Hiring AI - not clickable */}
      <div
        className={cn(
          cardBase,
          'opacity-50 cursor-default select-none'
        )}
        style={{
          width: 280,
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Coming soon badge */}
        <span className="absolute top-3 right-3 text-mono-tag bg-[var(--cream-sidebar)] text-[var(--brown-soft)] px-2 py-0.5 rounded-full border border-[var(--border-light)]">
          Coming soon
        </span>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--cream)] border border-[var(--border-light)]">
          <Bot size={22} className="text-[var(--brown)]" />
        </div>
        <span className="font-display text-lg font-medium text-[var(--brown)]">
          Hiring AI
        </span>
        <span className="text-body-sm text-center text-[var(--brown-muted)]">
          Evaluate AI agents for your workflows
        </span>
      </div>
    </div>
  );
}
