'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, placeholder = 'Search...', className, ...props },
  ref
) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--brown-soft)' }}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
        style={{
          backgroundColor: 'var(--cream-card)',
          color: 'var(--brown)',
          borderColor: 'var(--border-default)',
        }}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export { SearchBar };
