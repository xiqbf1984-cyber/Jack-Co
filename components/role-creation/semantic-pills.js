'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { SEMANTIC_PILLS } from '@/lib/constants';

export default function SemanticPills({ inputText = '' }) {
  var activeKeys = useMemo(function () {
    if (!inputText.trim()) return new Set();
    var words = inputText.toLowerCase().split(/\s+/);
    var active = new Set();
    SEMANTIC_PILLS.forEach(function (pill) {
      if (pill.keywords.some(function (kw) {
        return words.some(function (w) { return w.includes(kw); });
      })) {
        active.add(pill.key);
      }
    });
    return active;
  }, [inputText]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SEMANTIC_PILLS.map(function (pill) {
        var isActive = activeKeys.has(pill.key);
        return (
          <span
            key={pill.key}
            className="flex items-center gap-1 px-3 py-1 text-body-xs font-medium transition-all duration-200 rounded-full select-none"
            style={{
              border: isActive
                ? '1px solid var(--accent-green)'
                : '1px solid var(--border-default)',
              backgroundColor: isActive
                ? 'rgba(39, 130, 91, 0.1)'
                : 'transparent',
              color: isActive
                ? 'var(--accent-green)'
                : 'var(--brown-soft)',
              animation: isActive ? 'pillPop 0.3s ease-out' : undefined,
            }}
          >
            {isActive && <Check size={11} strokeWidth={2.5} />}
            {pill.label}
          </span>
        );
      })}
    </div>
  );
}
