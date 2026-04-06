'use client';

import { useState, useRef, useEffect } from 'react';
import { SEARCH_CATEGORIES } from '@/lib/constants';

export default function CategoryDropdown({ onPreview, onSelect }) {
  var [openIndex, setOpenIndex] = useState(null);
  var wrapperRef = useRef(null);

  useEffect(function () {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenIndex(null);
        onPreview?.('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return function () { document.removeEventListener('mousedown', handleClickOutside); };
  }, [onPreview]);

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, position: 'relative' }}>
      {SEARCH_CATEGORIES.map(function (cat, idx) {
        var isOpen = openIndex === idx;

        return (
          <div key={cat.label} style={{ position: 'relative' }}>
            {/* Category tag button – no icon/emoji */}
            <button
              type="button"
              onClick={function () {
                setOpenIndex(isOpen ? null : idx);
                if (isOpen) onPreview?.('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 20,
                border: '1px solid ' + (isOpen ? 'var(--border-hover)' : 'var(--border-default)'),
                backgroundColor: isOpen ? 'var(--cream)' : '#fff',
                color: 'var(--brown)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              onMouseEnter={function (e) {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.backgroundColor = 'var(--cream)';
                }
              }}
              onMouseLeave={function (e) {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = '#fff';
                }
              }}
            >
              {cat.label}
            </button>

            {/* Dropdown list */}
            {isOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 8,
                  zIndex: 50,
                  minWidth: 240,
                  borderRadius: 12,
                  border: '1px solid var(--border-default)',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '6px 0',
                  animation: 'fsd 0.15s ease-out',
                }}
              >
                {cat.opts.map(function (opt, optIdx) {
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--brown)',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={function (e) {
                        e.currentTarget.style.backgroundColor = 'var(--cream)';
                        onPreview?.(opt.prompt);
                      }}
                      onMouseLeave={function (e) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        onPreview?.('');
                      }}
                      onClick={function () {
                        onSelect?.(opt.prompt);
                        setOpenIndex(null);
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
