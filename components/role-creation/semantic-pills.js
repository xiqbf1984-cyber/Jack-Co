'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SEMANTIC_PILLS } from '@/lib/constants';

export default function SemanticPills({ inputText = '' }) {
  const activeKeys = useMemo(() => {
    if (!inputText.trim()) return new Set();
    const words = inputText.toLowerCase().split(/\s+/);
    const active = new Set();
    SEMANTIC_PILLS.forEach((pill) => {
      if (pill.keywords.some((kw) => words.some((w) => w.includes(kw)))) {
        active.add(pill.key);
      }
    });
    return active;
  }, [inputText]);

  return (
    <div className="flex flex-wrap gap-2">
      {SEMANTIC_PILLS.map((pill) => {
        const isActive = activeKeys.has(pill.key);
        return (
          <span
            key={pill.key}
            className={cn(
              'px-3 py-1 text-body-xs font-medium transition-all duration-200',
              'border rounded-full select-none',
              isActive
                ? 'border-[var(--gold)] bg-[rgba(139,105,20,0.08)] text-[var(--gold)]'
                : 'border-[var(--border-default)] text-[var(--brown-soft)]',
              isActive && 'animate-pill-pop'
            )}
            style={isActive ? { animation: 'pillPop 0.3s ease-out' } : undefined}
          >
            {pill.label}
          </span>
        );
      })}
    </div>
  );
}
