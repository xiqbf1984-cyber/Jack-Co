'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'default', children, className, disabled, onClick, icon: Icon, ...props },
  ref
) {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon',
  };

  const sizes = {
    default: '',
    small: 'text-[11px] px-3 py-1.5 gap-1',
    icon: '',
  };

  const iconSizes = {
    default: 'w-10 h-10',
    small: 'w-8 h-8',
  };

  const isIconOnly = variant === 'icon';

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        base[variant] || base.primary,
        sizes[size],
        isIconOnly && iconSizes[size === 'small' ? 'small' : 'default'],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
