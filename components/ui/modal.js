'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';

function Modal({ open, onClose, title, children, className }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ paddingLeft: sidebarWidth, transition: 'padding-left 0.2s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fi"
        style={{ backgroundColor: 'rgba(26,22,18,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-4 animate-fade-scale',
          className
        )}
        style={{
          backgroundColor: 'var(--cream-card)',
          borderRadius: 'var(--radius-3xl)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-display-dialog">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover-bg-cream transition-colors cursor-pointer"
              style={{ borderRadius: 'var(--radius-sm)', color: 'var(--brown-soft)' }}
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
