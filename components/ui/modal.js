'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

function Modal({ open, onClose, title, children, className }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 animate-fi"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-4',
          'bg-[var(--cream-card)] rounded-[var(--radius-3xl)]',
          'shadow-[var(--shadow-modal)] animate-fade-scale',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-display-dialog">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--brown-soft)] hover:bg-[var(--cream)] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Modal };
