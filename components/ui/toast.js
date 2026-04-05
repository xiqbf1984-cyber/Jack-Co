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
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 max-w-sm" style={{ zIndex: 100 }}>
        {toasts.map((t) => {
          const Icon = icons[t.type] || icons.info;
          return (
            <div
              key={t.id}
              className="flex items-start gap-2.5 px-4 py-3 border animate-slide-up"
              style={{
                backgroundColor: 'var(--cream-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                borderColor: 'var(--border-default)',
                borderLeftWidth: 3,
                borderLeftColor: borderColors[t.type],
              }}
            >
              <Icon
                size={16}
                className="flex-shrink-0 mt-0.5"
                style={{ color: borderColors[t.type] }}
              />
              <p className="flex-1" style={{ fontSize: 13, color: 'var(--brown)' }}>{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 transition-colors cursor-pointer"
                style={{ color: 'var(--brown-soft)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brown)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--brown-soft)'; }}
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
