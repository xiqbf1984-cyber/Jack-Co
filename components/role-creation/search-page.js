'use client';

import { useState, useRef } from 'react';
import { Paperclip, Link2, Mic, Code2, Briefcase, Palette } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Backend Engineer in London', icon: Code2 },
  { label: 'Product Manager, Remote (US)', icon: Briefcase },
  { label: 'Senior Designer in SF', icon: Palette },
];

export default function SearchPage({ onSubmit }) {
  const [input, setInput] = useState('');
  const [keepPrivate, setKeepPrivate] = useState(false);
  const textareaRef = useRef(null);

  function handleSubmit(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSubmit?.(text);
  }

  function handleSuggestion(label) {
    setInput(label);
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-16">
      {/* Title */}
      <h1 className="text-display-hero mb-10 text-center">Who are you looking for?</h1>

      {/* Rich input card */}
      <div
        className="w-full max-w-2xl rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Paste a link to your JD or describe your next hire..."
          className="w-full px-6 pt-5 pb-3 text-body-lg resize-none focus:outline-none"
          style={{
            color: 'var(--brown)',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />

        {/* Keep private checkbox */}
        <div className="px-6 pb-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepPrivate}
              onChange={(e) => setKeepPrivate(e.target.checked)}
              className="w-3.5 h-3.5 rounded cursor-pointer accent-current"
              style={{ accentColor: 'var(--gold)' }}
            />
            <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
              Keep role private
            </span>
          </label>
        </div>

        {/* Bottom toolbar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--border-light)' }}
        >
          {/* Left: attachment + link */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover-bg-dim"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--orange)' }}
              title="Attach file"
            >
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover-bg-dim"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--orange)' }}
              title="Paste link"
            >
              <Link2 size={16} />
            </button>
          </div>

          {/* Right: speak + mic */}
          <div className="flex items-center gap-3">
            <span className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
              Press space to speak
            </span>
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'linear-gradient(135deg, #e8553d, #f06040)',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(232, 85, 61, 0.3)',
              }}
              title="Voice input"
            >
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        {SUGGESTIONS.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => handleSuggestion(suggestion.label)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-body-sm transition-all duration-200 cursor-pointer"
              style={{
                background: 'none',
                border: '1px solid var(--border-default)',
                color: 'var(--brown-soft)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.backgroundColor = 'var(--cream-card)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon size={14} />
              {suggestion.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
