'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function Typewriter({ text, delay = 60, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Text fully typed - fire onComplete immediately, then fade cursor
      onComplete?.();
      const fadeTimeout = setTimeout(() => {
        setCursorFading(true);
        setTimeout(() => setShowCursor(false), 500);
      }, 800);
      return () => clearTimeout(fadeTimeout);
    }
  }, [displayedText, text, delay, onComplete]);

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
