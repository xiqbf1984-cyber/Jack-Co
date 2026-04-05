'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ToggleBar({ options = [], value, onChange }) {
  const [selected, setSelected] = useState(value ?? options[0] ?? '');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  const activeValue = value !== undefined ? value : selected;

  useEffect(() => {
    const btn = buttonRefs.current[activeValue];
    if (btn && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [activeValue, options]);

  const handleSelect = (opt) => {
    if (value === undefined) {
      setSelected(opt);
    }
    onChange?.(opt);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full p-1"
      style={{ backgroundColor: '#5C5248' }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: '#fcfbf7',
          left: indicatorStyle.left ?? 0,
          width: indicatorStyle.width ?? 0,
        }}
      />

      {options.map((opt) => (
        <button
          key={opt}
          ref={(el) => { buttonRefs.current[opt] = el; }}
          onClick={() => handleSelect(opt)}
          className={cn(
            'relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer',
            'whitespace-nowrap select-none',
            activeValue === opt
              ? 'text-[var(--brown)]'
              : 'text-[#FBF9F4]'
          )}
          style={{ background: 'transparent', border: 'none' }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
