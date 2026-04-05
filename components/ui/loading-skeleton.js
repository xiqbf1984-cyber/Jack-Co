'use client';

import { cn } from '@/lib/utils';

const variantStyles = {
  line: 'rounded-[var(--radius-sm)]',
  circle: 'rounded-full',
  card: 'rounded-[var(--radius-lg)]',
};

const variantDefaults = {
  line: { width: '100%', height: '14px' },
  circle: { width: '40px', height: '40px' },
  card: { width: '100%', height: '120px' },
};

function LoadingSkeleton({ width, height, className, variant = 'line' }) {
  const defaults = variantDefaults[variant] || variantDefaults.line;

  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--border-light)]',
        variantStyles[variant] || variantStyles.line,
        className
      )}
      style={{
        width: width || defaults.width,
        height: height || defaults.height,
      }}
    />
  );
}

export { LoadingSkeleton };
