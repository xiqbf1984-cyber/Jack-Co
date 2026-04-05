'use client';

import { useState, useRef, useEffect } from 'react';

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
    if (value === undefined) setSelected(opt);
    onChange?.(opt);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full"
      style={{ backgroundColor: '#5C5248', padding: 4 }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute rounded-full"
        style={{
          backgroundColor: '#fcfbf7',
          top: 4,
          bottom: 4,
          left: indicatorStyle.left ?? 0,
          width: indicatorStyle.width ?? 0,
          transition: 'all 0.3s ease',
        }}
      />

      {options.map((opt) => (
        <button
          key={opt}
          ref={(el) => { buttonRefs.current[opt] = el; }}
          onClick={() => handleSelect(opt)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '6px 16px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            background: 'transparent',
            border: 'none',
            color: activeValue === opt ? 'var(--brown)' : '#FBF9F4',
            transition: 'color 0.2s ease',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
