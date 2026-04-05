'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, placeholder = 'Search...', className, ...props },
  ref
) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center',
        focused && 'animate-glow',
        className
      )}
    >
      <Search
        size={15}
        className="absolute left-3 pointer-events-none"
        style={{ color: 'var(--brown-soft)' }}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-3 py-2 border outline-none transition-all duration-200 focus-border-hover"
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

SearchBar.displayName = 'SearchBar';

export { SearchBar };
