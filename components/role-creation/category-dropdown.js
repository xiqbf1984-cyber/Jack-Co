'use client';

import { useState, useRef, useEffect } from 'react';
import { SEARCH_CATEGORIES } from '@/lib/constants';
import { Briefcase, BarChart3, Target, MapPin } from 'lucide-react';

var ICON_MAP = { Briefcase, BarChart3, Target, MapPin };

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
    <div ref={wrapperRef} className="flex flex-wrap gap-2 relative">
      {SEARCH_CATEGORIES.map(function (cat, idx) {
        var Icon = ICON_MAP[cat.icon] || Briefcase;
        var isOpen = openIndex === idx;

        return (
          <div key={cat.label} className="relative">
            <button
              type="button"
              onClick={function () {
                setOpenIndex(isOpen ? null : idx);
                if (isOpen) onPreview?.('');
              }}
              className="btn-secondary text-body-xs flex items-center gap-1.5 px-3 py-1.5"
              style={isOpen ? { borderColor: 'var(--border-hover)', backgroundColor: 'var(--cream)' } : undefined}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>

            {isOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 z-50 py-1 rounded-lg animate-fsd"
                style={{
                  boxShadow: 'var(--shadow-dropdown)',
                  minWidth: 220,
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                }}
              >
                {cat.opts.map(function (opt) {
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      className="w-full text-left px-3 py-2 text-body-sm hover-bg-cream transition-colors"
                      style={{ color: 'var(--brown)' }}
                      onMouseEnter={function () { onPreview?.(opt.prompt); }}
                      onMouseLeave={function () { onPreview?.(''); }}
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
