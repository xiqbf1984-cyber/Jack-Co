'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
  { label, placeholder, value, onChange, type = 'text', className, error, id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-mono-label"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full px-4 py-3',
          'border outline-none transition-all duration-200',
          !error && 'focus-border-hover',
          className
        )}
        style={{
          fontSize: 13,
          backgroundColor: 'var(--cream)',
          color: 'var(--brown)',
          borderRadius: 'var(--radius-md)',
          borderColor: error ? 'var(--red)' : 'var(--border-default)',
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
