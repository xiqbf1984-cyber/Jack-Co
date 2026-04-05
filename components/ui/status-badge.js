'use client';

import { cn } from '@/lib/utils';
import { STATUS_MAP } from '@/lib/constants';

const dotColorMap = {
  'accent-green': 'var(--accent-green)',
  'blue': 'var(--blue)',
  'orange': 'var(--orange)',
  'red': 'var(--red)',
  'brown-light': 'var(--brown-light)',
  'gold': 'var(--gold)',
};

function StatusBadge({ status, className }) {
  const entry = STATUS_MAP[status];
  if (!entry) return null;

  const dotColor = dotColorMap[entry.color] || 'var(--brown-soft)';

  return (
    <span
      className={cn(
        'text-mono-tag inline-flex items-center gap-1.5 px-2 py-0.5',
        className
      )}
      style={{ color: dotColor, borderRadius: 'var(--radius-sm)' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      {entry.label}
    </span>
  );
}

export { StatusBadge };
