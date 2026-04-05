'use client';

import { cn } from '@/lib/utils';

const colorMap = {
  green: { bg: 'rgba(39, 130, 91, 0.1)', text: 'var(--accent-green)' },
  red: { bg: 'rgba(192, 57, 43, 0.1)', text: 'var(--red)' },
  blue: { bg: 'rgba(0, 119, 181, 0.1)', text: 'var(--blue)' },
  orange: { bg: 'rgba(212, 136, 15, 0.1)', text: 'var(--orange)' },
  gold: { bg: 'rgba(139, 105, 20, 0.1)', text: 'var(--gold)' },
  brown: { bg: 'rgba(93, 84, 70, 0.08)', text: 'var(--brown-soft)' },
};

function Badge({ children, color = 'brown', className }) {
  const colors = colorMap[color] || colorMap.brown;

  return (
    <span
      className={cn(
        'text-mono-tag inline-flex items-center px-2 py-0.5',
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {children}
    </span>
  );
}

export { Badge };
