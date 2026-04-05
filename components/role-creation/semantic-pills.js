'use client';

import { useMemo } from 'react';
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
            className="px-3 py-1 text-body-xs font-medium transition-all duration-200 rounded-full select-none"
            style={{
              border: isActive ? '1px solid var(--gold)' : '1px solid var(--border-default)',
              backgroundColor: isActive ? 'rgba(139,105,20,0.08)' : 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--brown-soft)',
              animation: isActive ? 'pillPop 0.3s ease-out' : undefined,
            }}
          >
            {pill.label}
          </span>
        );
      })}
    </div>
  );
}
