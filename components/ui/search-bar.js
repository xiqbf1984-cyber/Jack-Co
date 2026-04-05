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
        focused && 'animate-glow rounded-[var(--radius-md)]',
        className
      )}
    >
      <Search
        size={15}
        className="absolute left-3 text-[var(--brown-soft)] pointer-events-none"
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full pl-9 pr-3 py-2 text-[13px]',
          'bg-[var(--cream)] text-[var(--brown)]',
          'border border-[var(--border-default)] rounded-[var(--radius-md)]',
          'outline-none transition-all duration-200',
          'placeholder:text-[var(--brown-soft)]',
          'focus:border-[var(--border-hover)]'
        )}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export { SearchBar };
