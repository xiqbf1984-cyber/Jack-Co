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
            'px-2.5 py-1.5 whitespace-nowrap',
            'animate-fsd z-50 pointer-events-none',
            className
          )}
          style={{
            fontSize: 11,
            backgroundColor: 'var(--brown)',
            color: 'var(--cream)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-dropdown)',
          }}
        >
          {content}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid var(--brown)',
            }}
          />
        </div>
      )}
    </div>
  );
}

export { Tooltip };
