'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
  { label, placeholder, value, onChange, type = 'text', className, error, id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
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
          'w-full px-3 py-2 text-[13px]',
          'bg-[var(--cream)] text-[var(--brown)]',
          'border rounded-[var(--radius-md)]',
          'outline-none transition-all duration-200',
          'placeholder:text-[var(--brown-soft)]',
          error
            ? 'border-[var(--red)] focus:border-[var(--red)]'
            : 'border-[var(--border-default)] focus:border-[var(--border-hover)]',
          'focus:shadow-[0_0_0_3px_rgba(139,105,20,0.08)]',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-[11px] text-[var(--red)]">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
