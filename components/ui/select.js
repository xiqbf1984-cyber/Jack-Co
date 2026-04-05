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
            'w-full px-3 py-2 pr-8 text-[13px] appearance-none',
            'bg-[var(--cream)] text-[var(--brown)]',
            'border border-[var(--border-default)] rounded-[var(--radius-md)]',
            'outline-none transition-all duration-200',
            'focus:border-[var(--border-hover)] focus:shadow-[0_0_0_3px_rgba(139,105,20,0.08)]',
            'cursor-pointer',
            className
          )}
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
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--brown-soft)] pointer-events-none"
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
