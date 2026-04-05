'use client';

import { useState, useRef, useEffect } from 'react';

export default function ToggleBar({ options = [], value, onChange, disabledOptions = [] }) {
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
    if (disabledOptions.includes(opt)) return;
    if (value === undefined) setSelected(opt);
    onChange?.(opt);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        backgroundColor: '#5C5248',
        padding: 4,
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          borderRadius: 9999,
          backgroundColor: '#fcfbf7',
          top: 4,
          bottom: 4,
          left: indicatorStyle.left ?? 0,
          width: indicatorStyle.width ?? 0,
          transition: 'all 0.3s ease',
        }}
      />

      {options.map((opt) => {
        const isDisabled = disabledOptions.includes(opt);
        const isActive = activeValue === opt;
        return (
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
              cursor: isDisabled ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--brown)' : isDisabled ? 'rgba(251,249,244,0.4)' : '#FBF9F4',
              transition: 'color 0.2s ease',
              opacity: isDisabled && !isActive ? 0.5 : 1,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
