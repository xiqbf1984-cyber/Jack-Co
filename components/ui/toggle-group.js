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
        'relative inline-flex items-center p-1',
        className
      )}
      style={{ backgroundColor: '#5C5248', borderRadius: 'var(--radius-pill)' }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 transition-all duration-200 ease-out"
        style={{
          left: `${indicator.left}px`,
          width: `${indicator.width}px`,
          backgroundColor: '#fcfbf7',
          borderRadius: 'calc(var(--radius-pill) - 2px)',
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
            className="relative z-10 px-4 py-1.5 transition-colors duration-200 cursor-pointer select-none whitespace-nowrap"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: isActive ? 'var(--brown)' : 'var(--cream)',
              borderRadius: 'calc(var(--radius-pill) - 2px)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export { ToggleGroup };
