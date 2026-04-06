'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Link2, Upload } from 'lucide-react';
import CategoryDropdown from './category-dropdown';

const TYPEWRITER_TEXT = 'What AI talent are you looking for?';
const TYPEWRITER_SPEED = 38;

export default function SearchPage({ onSubmit }) {
  const [input, setInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [twText, setTwText] = useState('');
  const [twDone, setTwDone] = useState(false);
  const textareaRef = useRef(null);

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '40px 24px',
    }}>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 26,
        fontWeight: 700,
        color: 'var(--brown)',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 1.2,
      }}>
        {twText}
        {!twDone && (
          <span style={{
            display: 'inline-block',
            width: 2,
            height: '0.85em',
            backgroundColor: 'var(--brown)',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 1s step-end infinite',
          }} />
        )}
      </h1>

      {/* Content */}
      <div style={{
        opacity: twDone ? 1 : 0,
        transition: 'opacity 0.4s ease',
        width: '100%',
        maxWidth: 540,
      }}>
        {/* Search card */}
        <form onSubmit={handleSubmit}>
          <div style={{
            position: 'relative',
            borderRadius: 16,
            border: `1.5px solid ${hasInput ? 'var(--border-hover)' : 'var(--border-default)'}`,
            backgroundColor: '#fff',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
            boxShadow: hasInput ? '0 2px 12px rgba(0,0,0,0.04)' : undefined,
            animation: !hasInput ? 'inputGlow 3s infinite' : undefined,
          }}>
            {/* Ghost overlay */}
            {ghostText && !input && (
              <div style={{
                position: 'absolute',
                left: 20,
                top: 18,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--brown-light)',
                opacity: 0.35,
                pointerEvents: 'none',
              }}>
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
              style={{
                width: '100%',
                padding: '18px 20px 8px',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--brown)',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px 10px',
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  title="Paste a link"
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: 'var(--brown-light)',
                  }}
                >
                  <Link2 size={15} />
                </button>
                <button
                  type="button"
                  title="Upload a file"
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: 'var(--brown-light)',
                  }}
                >
                  <Upload size={15} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!hasInput}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none',
                  background: hasInput
                    ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                    : 'var(--cream)',
                  color: hasInput ? '#fff' : 'var(--brown-light)',
                  cursor: hasInput ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>

          {/* Category quick-fills */}
          <div style={{ marginTop: 16 }}>
            <CategoryDropdown onPreview={handlePreview} onSelect={handleCategorySelect} />
          </div>
        </form>
      </div>
    </div>
  );
}
