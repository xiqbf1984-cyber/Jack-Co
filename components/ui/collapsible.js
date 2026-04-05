'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

function Collapsible({ title, children, defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open]);

  // Allow auto height after transition completes when opening
  useEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    const handler = () => setHeight('auto');
    el?.addEventListener('transitionend', handler, { once: true });
    return () => el?.removeEventListener('transitionend', handler);
  }, [open]);

  return (
    <div
      className={cn('rounded-xl', className)}
      style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)' }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer group"
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown)' }}>{title}</span>
        <ChevronRight
          size={16}
          className={cn(
            'transition-transform duration-200',
            open && 'rotate-90'
          )}
          style={{ color: 'var(--brown-soft)' }}
        />
      </button>
      <div
        ref={contentRef}
        style={{ height }}
        className="overflow-hidden transition-[height] duration-200 ease-out"
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

export { Collapsible };
