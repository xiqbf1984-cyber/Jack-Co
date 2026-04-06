'use client';

import { useState, useRef } from 'react';
import { ArrowRight, Link2, Upload } from 'lucide-react';
import SemanticPills from './semantic-pills';
import CategoryDropdown from './category-dropdown';

export default function SearchPage({ onSubmit }) {
  const [input, setInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const textareaRef = useRef(null);

  function handleSubmit(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSubmit?.(text);
  }

  function handlePreview(prompt) {
    setGhostText(prompt);
  }

  function handleCategorySelect(prompt) {
    setInput((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}. ${prompt}` : prompt;
    });
    setGhostText('');
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {/* Title */}
      <h1
        className="text-center mb-6"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--brown)',
        }}
      >
        What AI talent are you looking for?
      </h1>

      {/* Semantic pills */}
      <div className="mb-6">
        <SemanticPills inputText={input} />
      </div>

      {/* Search textarea card */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-6">
        <div
          className="relative w-full rounded-xl border transition-all"
          style={{
            backgroundColor: 'var(--cream-card)',
            borderColor: 'var(--border-default)',
            ...(!input.trim()
              ? { animation: 'inputGlow 3s infinite' }
              : { boxShadow: 'var(--shadow-card)' }),
          }}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe the role, paste a JD link..."
            className="w-full px-5 pt-4 pb-2 text-body-sm border-none bg-transparent resize-vertical focus:outline-none"
            style={{
              color: 'var(--brown)',
              minHeight: 60,
            }}
          />

          {/* Ghost text overlay */}
          {ghostText && !input && (
            <div
              className="absolute top-0 left-0 right-0 px-5 pt-4 pb-2 pointer-events-none text-body-sm opacity-50"
              style={{ color: 'var(--brown-light)' }}
            >
              {ghostText}
            </div>
          )}

          {/* Toolbar row */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover-bg-cream"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--brown-soft)',
                  backgroundColor: 'var(--cream-card)',
                }}
                title="Paste link"
              >
                <Link2 size={14} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover-bg-cream"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--brown-soft)',
                  backgroundColor: 'var(--cream-card)',
                }}
                title="Upload JD"
              >
                <Upload size={14} />
              </button>
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: input.trim() ? 'var(--gold)' : 'var(--border-default)',
                color: 'var(--btn-text)',
                border: 'none',
              }}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Category dropdowns */}
        <CategoryDropdown onPreview={handlePreview} onSelect={handleCategorySelect} />
      </form>
    </div>
  );
}
