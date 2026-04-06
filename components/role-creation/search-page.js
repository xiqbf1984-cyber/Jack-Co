'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Link2, Upload } from 'lucide-react';
import SemanticPills from './semantic-pills';
import CategoryDropdown from './category-dropdown';

const TYPEWRITER_TEXT = 'What AI talent are you looking for?';
const TYPEWRITER_SPEED = 38;

export default function SearchPage({ onSubmit }) {
  const [input, setInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [twText, setTwText] = useState('');
  const [twDone, setTwDone] = useState(false);
  const textareaRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTwText(TYPEWRITER_TEXT.slice(0, i));
      if (i >= TYPEWRITER_TEXT.length) {
        clearInterval(timer);
        setTwDone(true);
      }
    }, TYPEWRITER_SPEED);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e) {
    e?.preventDefault();
    var text = input.trim();
    if (!text) return;
    onSubmit?.(text);
  }

  var handlePreview = useCallback(function (prompt) {
    setGhostText(prompt);
  }, []);

  var handleCategorySelect = useCallback(function (prompt) {
    setInput(function (prev) {
      var trimmed = prev.trim();
      return trimmed ? trimmed + '. ' + prompt : prompt;
    });
    setGhostText('');
    textareaRef.current?.focus();
  }, []);

  var hasInput = input.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      {/* Title with typewriter effect */}
      <h1
        className="mb-8 text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--brown)',
        }}
      >
        {twText}
        {!twDone && (
          <span
            className="inline-block ml-0.5 animate-blink"
            style={{
              width: 2,
              height: '0.9em',
              backgroundColor: 'var(--brown)',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
      </h1>

      {/* Content fades in after typewriter */}
      <div
        style={{
          opacity: twDone ? 1 : 0,
          transition: 'opacity 0.5s ease',
          width: '100%',
          maxWidth: 660,
        }}
      >
        {/* Semantic pills */}
        <div className="mb-5">
          <SemanticPills inputText={input} />
        </div>

        {/* Search card */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div
            className="relative rounded-2xl overflow-hidden transition-all"
            style={{
              border: '1.5px solid var(--border-default)',
              backgroundColor: 'var(--cream-card)',
              boxShadow: hasInput ? 'var(--shadow-card)' : undefined,
              animation: !hasInput ? 'inputGlow 3s infinite' : undefined,
            }}
          >
            {/* Ghost text overlay */}
            {ghostText && !input && (
              <div
                className="absolute px-5 pt-4 pointer-events-none text-body-lg"
                style={{ color: 'var(--brown-light)', opacity: 0.4 }}
              >
                {ghostText}
              </div>
            )}

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
              placeholder="Describe the role, paste a JD link, or upload a file..."
              className="w-full px-5 pt-4 pb-2 text-body-lg resize-none focus:outline-none bg-transparent"
              style={{ color: 'var(--brown)' }}
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors hover-bg-cream"
                  style={{ color: 'var(--brown-muted)' }}
                  title="Paste a link"
                >
                  <Link2 size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors hover-bg-cream"
                  style={{ color: 'var(--brown-muted)' }}
                  title="Upload a file"
                >
                  <Upload size={16} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!hasInput}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: 34,
                  height: 34,
                  background: hasInput
                    ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                    : 'var(--cream-sidebar)',
                  color: hasInput ? 'var(--btn-text)' : 'var(--brown-muted)',
                  cursor: hasInput ? 'pointer' : 'default',
                }}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>

          {/* Category filter buttons */}
          <CategoryDropdown onPreview={handlePreview} onSelect={handleCategorySelect} />
        </form>
      </div>
    </div>
  );
}
