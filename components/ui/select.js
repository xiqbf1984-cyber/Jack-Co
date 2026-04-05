'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, value, onChange, options = [], placeholder, className, id, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-mono-label"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-3 py-2 pr-8 appearance-none',
            'border outline-none transition-all duration-200',
            'focus-border-hover cursor-pointer',
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--brown-soft)' }}
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
