'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(function Textarea(
  { label, placeholder, value, onChange, rows = 4, className, id, ...props },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-mono-label"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={cn(
          'w-full px-3 py-2 text-[13px]',
          'bg-[var(--cream)] text-[var(--brown)]',
          'border border-[var(--border-default)] rounded-[var(--radius-md)]',
          'outline-none transition-all duration-200',
          'placeholder:text-[var(--brown-soft)]',
          'focus:border-[var(--border-hover)] focus:shadow-[0_0_0_3px_rgba(139,105,20,0.08)]',
          'resize-y',
          className
        )}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
