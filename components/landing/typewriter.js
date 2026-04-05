'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function Typewriter({ text, delay = 60, onComplete, animate = false }) {
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);
  const [showCursor, setShowCursor] = useState(animate);
  const [cursorFading, setCursorFading] = useState(false);
  const indexRef = useRef(animate ? 0 : text.length);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!animate) {
      if (!completedRef.current) {
        onComplete?.();
        completedRef.current = true;
      }
      return;
    }

    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Text fully typed - fire onComplete immediately, then fade cursor
      if (!completedRef.current) {
        onComplete?.();
        completedRef.current = true;
      }
      const fadeTimeout = setTimeout(() => {
        setCursorFading(true);
        setTimeout(() => setShowCursor(false), 500);
      }, 800);
      return () => clearTimeout(fadeTimeout);
    }
  }, [animate, displayedText, text, delay, onComplete]);

  return (
    <span className="text-display-hero">
      {displayedText}
      {showCursor && (
        <span
          className={cn(
            'animate-blink inline-block font-light',
            cursorFading && 'transition-opacity duration-500 opacity-0'
          )}
          style={{ marginLeft: 2 }}
        >
          |
        </span>
      )}
    </span>
  );
}
