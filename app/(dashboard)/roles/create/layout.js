'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function RoleCreateLayout({ children }) {
  var [rightPanelVisible, setRightPanelVisible] = useState(false);
  var [splitRatio, setSplitRatio] = useState(0.42);
  var [headerHeight, setHeaderHeight] = useState(0);
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
      var ratio = px / rect.width;
      var clamped = Math.max(0.28, Math.min(0.60, ratio));
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

  useEffect(function () {
    function handleToggle(e) {
      setRightPanelVisible(e.detail?.visible ?? false);
    }
    window.addEventListener('jd-panel-toggle', handleToggle);
    return function () { window.removeEventListener('jd-panel-toggle', handleToggle); };
  }, []);

  // Measure header height from the page's header element
  useEffect(function () {
    function measure() {
      var header = document.getElementById('role-create-header');
      if (header) setHeaderHeight(header.offsetHeight);
    }
    measure();
    var timer = setInterval(measure, 300);
    var timeoutId = setTimeout(function () { clearInterval(timer); }, 3000);
    window.addEventListener('resize', measure);
    return function () {
      clearInterval(timer);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measure);
    };
  }, [rightPanelVisible]);

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
      {/* Split panels */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel */}
        <div
          style={{
            flex: rightPanelVisible ? 'none' : '1',
            width: rightPanelVisible ? (splitRatio * 100) + '%' : '100%',
            minWidth: rightPanelVisible ? 320 : undefined,
            transition: rightPanelVisible ? 'none' : 'width 0.35s ease',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {typeof children === 'object' && children}
        </div>

        {/* Divider */}
        {rightPanelVisible && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: 6, cursor: 'col-resize',
              backgroundColor: 'var(--border-light)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.15s ease', zIndex: 2,
            }}
            onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-hover)'; }}
            onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
          >
            <div style={{ width: 3, height: 40, borderRadius: 2, backgroundColor: 'var(--border-default)' }} />
          </div>
        )}

        {/* Right panel – JD canvas, with top padding matching header height */}
        {rightPanelVisible && (
          <div
            id="jd-canvas-panel"
            style={{
              flex: 1, minWidth: 380,
              overflow: 'hidden',
              animation: 'canvasIn 0.35s ease-out',
              display: 'flex', flexDirection: 'column',
              paddingTop: headerHeight > 0 ? headerHeight : 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
