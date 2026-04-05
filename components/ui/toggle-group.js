'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

function ToggleGroup({ options = [], value, onChange, className }) {
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeIndex = options.findIndex((opt) => opt.value === value);
    if (activeIndex === -1) return;

    const buttons = containerRef.current.querySelectorAll('[data-toggle-btn]');
    const btn = buttons[activeIndex];
    if (!btn) return;

    setIndicator({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
    });
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center p-1 rounded-[var(--radius-pill)]',
        className
      )}
      style={{ backgroundColor: '#5C5248' }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-[calc(var(--radius-pill)-2px)] transition-all duration-200 ease-out"
        style={{
          left: `${indicator.left}px`,
          width: `${indicator.width}px`,
          backgroundColor: '#fcfbf7',
        }}
      />

      {/* Options */}
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            data-toggle-btn=""
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'relative z-10 px-4 py-1.5 text-[12px] font-medium',
              'rounded-[calc(var(--radius-pill)-2px)] transition-colors duration-200',
              'cursor-pointer select-none whitespace-nowrap',
              isActive
                ? 'text-[var(--brown)]'
                : 'text-[var(--cream)] hover:text-white'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export { ToggleGroup };
