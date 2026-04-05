'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const borderColors = {
  success: 'var(--accent-green)',
  error: 'var(--red)',
  info: 'var(--blue)',
};

let toastId = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message, duration = 3000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, opts) => addToast({ type: 'success', message, ...opts }),
      error: (message, opts) => addToast({ type: 'error', message, ...opts }),
      info: (message, opts) => addToast({ type: 'info', message, ...opts }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => {
          const Icon = icons[t.type] || icons.info;
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-2.5 px-4 py-3',
                'bg-[var(--cream-card)] rounded-[var(--radius-lg)]',
                'shadow-[var(--shadow-dropdown)] border border-[var(--border-default)]',
                'animate-slide-up'
              )}
              style={{ borderLeftWidth: 3, borderLeftColor: borderColors[t.type] }}
            >
              <Icon
                size={16}
                className="flex-shrink-0 mt-0.5"
                style={{ color: borderColors[t.type] }}
              />
              <p className="text-[13px] text-[var(--brown)] flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-[var(--brown-soft)] hover:text-[var(--brown)] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export { ToastProvider, useToast };
