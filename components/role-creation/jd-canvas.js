'use client';

import { useMemo } from 'react';
import { Save } from 'lucide-react';

export default function JDCanvas({ content = '', onChange, onSave }) {
  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden animate-canvas-in"
      style={{
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--cream-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <h2 className="text-display-section">Job Description</h2>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="btn-primary text-body-xs flex items-center gap-1.5"
          >
            <Save size={13} />
            Save Role
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-hidden flex flex-col">
        <textarea
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 w-full resize-none text-body-sm leading-relaxed bg-transparent focus:outline-none"
          style={{ color: 'var(--brown)' }}
          placeholder="Your job description will appear here..."
        />
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2 text-body-xs"
        style={{
          borderTop: '1px solid var(--border-light)',
          color: 'var(--brown-soft)',
        }}
      >
        {wordCount} words
      </div>
    </div>
  );
}
