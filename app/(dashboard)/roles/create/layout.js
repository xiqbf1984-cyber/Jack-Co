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
      setSplitRatio(Math.max(0.28, Math.min(0.60, ratio)));
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
    function handleToggle(e) { setRightPanelVisible(e.detail?.visible ?? false); }
    window.addEventListener('jd-panel-toggle', handleToggle);
    return function () { window.removeEventListener('jd-panel-toggle', handleToggle); };
  }, []);

  // Measure header
  useEffect(function () {
    function measure() {
      var h = document.getElementById('role-create-header');
      if (h) setHeaderHeight(h.offsetHeight);
    }
    measure();
    var t = setInterval(measure, 300);
    setTimeout(function () { clearInterval(t); }, 3000);
    window.addEventListener('resize', measure);
    return function () { clearInterval(t); window.removeEventListener('resize', measure); };
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
      {/*
        The page renders its header (with id="role-create-header") inside the left panel.
        We use its measured height to create a full-width header zone.
      */}

      {/* Full-width header zone — covers both panels */}
      {rightPanelVisible && headerHeight > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: headerHeight,
          backgroundColor: 'var(--cream)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />
      )}

      {/* Content split */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left panel — overflow visible so header extends across both panels */}
        <div style={{
          flex: rightPanelVisible ? 'none' : '1',
          width: rightPanelVisible ? (splitRatio * 100) + '%' : '100%',
          minWidth: rightPanelVisible ? 320 : undefined,
          transition: rightPanelVisible ? 'none' : 'width 0.35s ease',
          display: 'flex', flexDirection: 'column',
          overflow: rightPanelVisible ? 'visible' : 'hidden',
          zIndex: 4,
          '--full-width-pct': rightPanelVisible ? ((100 / splitRatio) + '%') : '100%',
        }}>
          {typeof children === 'object' && children}
        </div>

        {/* Divider — starts below header */}
        {rightPanelVisible && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: 5, cursor: 'col-resize',
              backgroundColor: 'var(--border-light)', flexShrink: 0,
              marginTop: headerHeight,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-hover)'; }}
            onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
          />
        )}

        {/* Right panel — starts below header */}
        {rightPanelVisible && (
          <div
            id="jd-canvas-panel"
            style={{
              flex: 1, minWidth: 380,
              overflow: 'hidden',
              animation: 'canvasIn 0.35s ease-out',
              display: 'flex', flexDirection: 'column',
              marginTop: headerHeight,
            }}
          />
        )}
      </div>
    </div>
  );
}
