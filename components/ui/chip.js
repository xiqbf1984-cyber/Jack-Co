'use client';

import { cn } from '@/lib/utils';

function Chip({ children, selected = false, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1 text-[12px]',
        'rounded-[var(--radius-pill)] border transition-all duration-200',
        'cursor-pointer select-none',
        selected
          ? 'border-[var(--accent-green)] bg-[rgba(39,130,91,0.06)] text-[var(--accent-green)] font-medium'
          : 'border-[var(--border-default)] bg-[var(--cream-card)] text-[var(--brown)] hover:border-[var(--border-hover)]',
        className
      )}
    >
      {children}
    </button>
  );
}

export { Chip };
