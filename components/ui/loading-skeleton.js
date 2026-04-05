'use client';

import { cn } from '@/lib/utils';

const variantDefaults = {
  line: { width: '100%', height: '14px', radius: 'var(--radius-sm)' },
  circle: { width: '40px', height: '40px', radius: '9999px' },
  card: { width: '100%', height: '120px', radius: 'var(--radius-lg)' },
};

function LoadingSkeleton({ width, height, className, variant = 'line' }) {
  const defaults = variantDefaults[variant] || variantDefaults.line;

  return (
    <div
      className={cn('animate-pulse', className)}
      style={{
        width: width || defaults.width,
        height: height || defaults.height,
        borderRadius: defaults.radius,
        backgroundColor: 'var(--border-light)',
      }}
    />
  );
}

export { LoadingSkeleton };
