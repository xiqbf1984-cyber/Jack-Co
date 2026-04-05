'use client';

import { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Typewriter from '@/components/landing/typewriter';
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
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 animate-fi">
      {/* Typewriter title */}
      <div className="mb-8 text-center">
        <Typewriter text="Describe your next hire" animate={false} />
      </div>

      {/* Search textarea */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-5">
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Senior ML Engineer with 5+ years PyTorch experience..."
            className="w-full px-5 py-4 text-body-lg border rounded-xl resize-none focus:outline-none focus-border-hover transition-all"
            style={{
              ...(!input.trim()
                ? { animation: 'inputGlow 3s infinite' }
                : { boxShadow: 'var(--shadow-card)' }),
              color: 'var(--brown)',
              backgroundColor: 'var(--cream-card)',
              borderColor: 'var(--border-default)',
            }}
          />

          {/* Ghost text overlay */}
          {ghostText && !input && (
            <div className="absolute inset-0 px-5 py-4 pointer-events-none text-body-lg opacity-50" style={{ color: 'var(--brown-light)' }}>
              {ghostText}
            </div>
          )}

          {/* Send button */}
          {input.trim() && (
            <button
              type="submit"
              className="absolute bottom-3 right-3 btn-primary p-2 rounded-lg animate-fade-scale"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Semantic pills */}
        <SemanticPills inputText={input} />

        {/* Category dropdowns */}
        <CategoryDropdown onPreview={handlePreview} onSelect={handleCategorySelect} />
      </form>
    </div>
  );
}
