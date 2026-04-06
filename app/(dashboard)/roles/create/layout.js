'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function RoleCreateLayout({ children }) {
  var [rightPanelVisible, setRightPanelVisible] = useState(false);
  var [splitWidth, setSplitWidth] = useState(380); // left panel width in px
  var isDragging = useRef(false);
  var containerRef = useRef(null);

  var handleMouseDown = useCallback(function (e) {
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
      var clamped = Math.max(280, Math.min(600, px));
      setSplitWidth(clamped);
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

  useEffect(function () {
    function handleToggle(e) {
      setRightPanelVisible(e.detail?.visible ?? false);
    }
    window.addEventListener('jd-panel-toggle', handleToggle);
    return function () { window.removeEventListener('jd-panel-toggle', handleToggle); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full overflow-hidden"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Left panel */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          flex: rightPanelVisible ? 'none' : '1',
          width: rightPanelVisible ? splitWidth : '100%',
          minWidth: rightPanelVisible ? 280 : undefined,
          transition: rightPanelVisible ? 'none' : 'width 0.35s ease',
        }}
      >
        {typeof children === 'object' && children}
      </div>

      {/* Divider with handle */}
      {rightPanelVisible && (
        <div
          onMouseDown={handleMouseDown}
          className="shrink-0 flex items-center justify-center transition-colors"
          style={{
            width: 6,
            cursor: 'col-resize',
            backgroundColor: 'var(--border-light)',
          }}
          onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-hover)'; }}
          onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
        >
          {/* Visual handle */}
          <div
            style={{
              width: 3,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'var(--border-default)',
            }}
          />
        </div>
      )}

      {/* Right panel - JD canvas */}
      {rightPanelVisible && (
        <div
          id="jd-canvas-panel"
          className="flex flex-col overflow-hidden animate-canvas-in"
          style={{
            flex: 1,
            minWidth: 400,
          }}
        />
      )}
    </div>
  );
}
