'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

function Tooltip({ content, children, className }) {
  const [visible, setVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
            'px-2.5 py-1.5 text-[11px] whitespace-nowrap',
            'bg-[var(--brown)] text-[var(--cream)] rounded-[var(--radius-sm)]',
            'shadow-[var(--shadow-dropdown)] animate-fsd',
            'z-50 pointer-events-none',
            className
          )}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--brown)]" />
        </div>
      )}
    </div>
  );
}

export { Tooltip };
