'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function RoleCreateLayout({ children }) {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const [dividerX, setDividerX] = useState(50); // percentage
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(30, Math.min(70, pct));
      setDividerX(clamped);
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
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Expose panel control via context-like approach through children props
  // We use a simple DOM-based approach: the page sets a data attribute
  useEffect(() => {
    function handleToggle(e) {
      setRightPanelVisible(e.detail?.visible ?? false);
    }
    window.addEventListener('jd-panel-toggle', handleToggle);
    return () => window.removeEventListener('jd-panel-toggle', handleToggle);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full overflow-hidden flex-1"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Left panel */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          flex: rightPanelVisible ? 'none' : '1',
          width: rightPanelVisible ? `${dividerX}%` : '100%',
          minWidth: '400px',
          transition: rightPanelVisible ? 'none' : 'width 0.35s ease',
        }}
      >
        {typeof children === 'object' && children}
      </div>

      {/* Divider */}
      {rightPanelVisible && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize transition-colors shrink-0"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-default)'; }}
          style={{ backgroundColor: 'var(--border-default)' }}
        />
      )}

      {/* Right panel - JD canvas placeholder, rendered by page via portal */}
      {rightPanelVisible && (
        <div
          id="jd-canvas-panel"
          className="flex flex-col overflow-hidden animate-canvas-in"
          style={{
            width: `${100 - dividerX}%`,
            minWidth: '400px',
          }}
        />
      )}
    </div>
  );
}
