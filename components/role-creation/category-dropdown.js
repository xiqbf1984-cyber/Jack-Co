'use client';

import { useState, useRef, useEffect } from 'react';
import { SEARCH_CATEGORIES } from '@/lib/constants';
import { useAppStore } from '@/stores/app-store';
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from '@/components/layout/sidebar';

var MAX_VISIBLE = 3;

export default function CategoryDropdown({ onPreview, onSelect }) {
  var [openIndex, setOpenIndex] = useState(null);
  var [modalCat, setModalCat] = useState(null);
  var wrapperRef = useRef(null);
  var sidebarCollapsed = useAppStore(function (s) { return s.sidebarCollapsed; });
  var sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

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

  // Close modal on Escape
  useEffect(function () {
    if (!modalCat) return;
    function handleKey(e) {
      if (e.key === 'Escape') setModalCat(null);
    }
    document.addEventListener('keydown', handleKey);
    return function () { document.removeEventListener('keydown', handleKey); };
  }, [modalCat]);

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, position: 'relative' }}>
      {SEARCH_CATEGORIES.map(function (cat, idx) {
        var isOpen = openIndex === idx;
        var visibleOpts = cat.opts.slice(0, MAX_VISIBLE);
        var hasMore = cat.opts.length > MAX_VISIBLE;

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

            {/* Dropdown list – show first 3 + View More */}
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
                  boxShadow: 'var(--shadow-dropdown)',
                  padding: '6px 0',
                  animation: 'fsd 0.15s ease-out',
                }}
              >
                {visibleOpts.map(function (opt) {
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

                {/* View More row with fade effect */}
                {hasMore && (
                  <div style={{ position: 'relative' }}>
                    {/* Blur/fade overlay above the View More button */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -24,
                        left: 0,
                        right: 0,
                        height: 24,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '10px 16px',
                        border: 'none',
                        borderTop: '1px solid var(--border-light)',
                        background: 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--brown-soft)',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease, color 0.1s ease',
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={function (e) {
                        e.currentTarget.style.backgroundColor = 'var(--cream)';
                        e.currentTarget.style.color = 'var(--brown)';
                      }}
                      onMouseLeave={function (e) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--brown-soft)';
                      }}
                      onClick={function () {
                        setModalCat(cat);
                        setOpenIndex(null);
                        onPreview?.('');
                      }}
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Full-options modal */}
      {modalCat && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: sidebarWidth,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
          onClick={function () { setModalCat(null); }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-modal)',
              padding: '24px 0',
              minWidth: 340,
              maxWidth: 480,
              width: '90%',
              maxHeight: '70vh',
              overflowY: 'auto',
              animation: 'fadeScale .2s ease both',
            }}
            onClick={function (e) { e.stopPropagation(); }}
          >
            {/* Modal title */}
            <div
              style={{
                padding: '0 24px 16px',
                borderBottom: '1px solid var(--border-light)',
                fontFamily: 'var(--font-body)',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--brown)',
              }}
            >
              {modalCat.label}
            </div>

            {/* All options */}
            <div style={{ padding: '8px 0' }}>
              {modalCat.opts.map(function (opt) {
                return (
                  <button
                    key={opt.label}
                    type="button"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 24px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: 'var(--brown)',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={function (e) {
                      e.currentTarget.style.backgroundColor = 'var(--cream)';
                    }}
                    onMouseLeave={function (e) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={function () {
                      onSelect?.(opt.prompt);
                      setModalCat(null);
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
