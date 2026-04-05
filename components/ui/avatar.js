'use client';

import { cn } from '@/lib/utils';

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-[12px]',
  lg: 'w-12 h-12 text-[14px]',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name, size = 'md', color, className }) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0',
        sizes[size] || sizes.md,
        className
      )}
      style={{
        background: color || 'linear-gradient(135deg, var(--gold) 0%, var(--brown) 100%)',
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

export { Avatar };
