'use client';

import { cn } from '@/lib/utils';

function Chip({ children, selected = false, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1',
        'border transition-all duration-200',
        'cursor-pointer select-none',
        !selected && 'hover-border-hover',
        className
      )}
      style={{
        fontSize: 12,
        borderRadius: 'var(--radius-pill)',
        ...(selected
          ? { borderColor: 'var(--accent-green)', backgroundColor: 'rgba(39,130,91,0.06)', color: 'var(--accent-green)', fontWeight: 500 }
          : { borderColor: 'var(--border-default)', backgroundColor: 'var(--cream-card)', color: 'var(--brown)' }),
      }}
    >
      {children}
    </button>
  );
}

export { Chip };
