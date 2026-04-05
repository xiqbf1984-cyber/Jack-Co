'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function Typewriter({ text, delay = 60, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);
  const indexRef = useRef(0);
  const completionFiredRef = useRef(false);

  useEffect(() => {
    setDisplayedText('');
    setShowCursor(true);
    setCursorFading(false);
    indexRef.current = 0;
    completionFiredRef.current = false;
  }, [text]);

  useEffect(() => {
    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      if (!completionFiredRef.current) {
        onComplete?.();
        completionFiredRef.current = true;
      }
      const fadeTimeout = setTimeout(() => {
        setCursorFading(true);
        setTimeout(() => setShowCursor(false), 500);
      }, 800);
      return () => clearTimeout(fadeTimeout);
    }
  }, [displayedText, text, delay, onComplete]);

  return (
    <span className="text-display-hero inline-flex min-h-[1.2em] items-center">
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
