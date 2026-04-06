'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(function Textarea(
  { label, placeholder, value, onChange, rows = 4, className, id, ...props },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2">
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
          'w-full px-4 py-3',
          'border outline-none transition-all duration-200',
          'focus-border-hover resize-y',
          className
        )}
        style={{
          fontSize: 13,
          backgroundColor: 'var(--cream)',
          color: 'var(--brown)',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
        }}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
