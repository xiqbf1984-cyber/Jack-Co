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
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--border-light)' }}
          >
            <Users size={22} style={{ color: 'var(--brown)' }} />
          </div>
          <span className="font-display text-lg font-medium" style={{ color: 'var(--brown)' }}>
            Hiring Human
          </span>
          <span className="text-body-sm text-center" style={{ color: 'var(--brown-muted)' }}>
            Evaluate real candidates
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
        <span
          className="absolute top-3 right-3 text-mono-tag px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--cream-sidebar)',
            color: 'var(--brown-soft)',
            border: '1px solid var(--border-light)',
          }}
        >
          Coming soon
        </span>
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--border-light)' }}
        >
          <Bot size={22} style={{ color: 'var(--brown)' }} />
        </div>
        <span className="font-display text-lg font-medium" style={{ color: 'var(--brown)' }}>
          Hiring AI
        </span>
        <span className="text-body-sm text-center" style={{ color: 'var(--brown-muted)' }}>
          Coming soon
        </span>
      </div>
    </div>
  );
}
