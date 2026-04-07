'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function CreateAssessmentLayout({ children }) {
  const [splitRatio, setSplitRatio] = useState(0.38);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback(function (e) {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(function () {
    function handleMouseMove(e) {
      if (!isDragging.current || !containerRef.current) return;
      var rect = containerRef.current.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var ratio = px / rect.width;
      var clamped = Math.max(0.28, Math.min(0.65, ratio));
      setSplitRatio(clamped);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return function () {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        margin: '-32px -32px -64px -32px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--cream)',
        overflow: 'hidden',
      }}
    >
      {/* Header area – rendered by page.js via portal */}
      <div id="assessment-header-area" />

      {/* Split content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Left: Operations */}
        <div
          style={{
            width: (splitRatio * 100) + '%',
            minWidth: 380,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>

        {/* Divider */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: 6,
            cursor: 'col-resize',
            backgroundColor: 'var(--border-light)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
            zIndex: 2,
          }}
          onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-hover)'; }}
          onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
        >
          <div style={{ width: 3, height: 40, borderRadius: 2, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Right: Preview */}
        <div
          id="assessment-preview-panel"
          style={{
            flex: 1,
            minWidth: 260,
            overflow: 'hidden',
            borderLeft: 'none',
            backgroundColor: '#fff',
          }}
        />
      </div>
    </div>
  );
}
