'use client';

import { useMemo, useState, useCallback } from 'react';
import { Save, Link2, Check } from 'lucide-react';

export default function JDCanvas({
  content = '',
  onChange,
  onSave,
  matchedRoleName,
  matchScore,
  sharableLink,
}) {
  var [linkCopied, setLinkCopied] = useState(false);

  var wordCount = useMemo(function () {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  var isEmpty = !content.trim();

  var handleCopyLink = useCallback(function () {
    if (!sharableLink) return;
    navigator.clipboard.writeText(sharableLink).then(function () {
      setLinkCopied(true);
      setTimeout(function () { setLinkCopied(false); }, 2000);
    });
  }, [sharableLink]);

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
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', var(--font-body)",
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--brown)',
            }}
          >
            Job Description
          </h2>
          {matchedRoleName && (
            <div
              className="flex items-center gap-1 mt-1"
              style={{
                fontFamily: "'DM Mono', monospace, var(--font-body)",
                fontSize: 10,
                color: matchScore > 0
                  ? 'var(--accent-green)'
                  : 'var(--brown-muted)',
              }}
            >
              {matchScore > 0 ? (
                <>
                  <Check size={10} strokeWidth={2.5} />
                  Matched: {matchedRoleName}
                </>
              ) : (
                'No strong match found'
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Copy link button */}
          {sharableLink && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1.5 text-body-xs rounded-lg transition-all hover-bg-cream"
              style={{
                border: '1px solid var(--border-default)',
                color: linkCopied ? 'var(--accent-green)' : 'var(--brown-muted)',
              }}
            >
              {linkCopied ? <Check size={12} /> : <Link2 size={12} />}
              {linkCopied ? 'Copied!' : 'Copy link'}
            </button>
          )}

          {/* Save button */}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isEmpty}
              className="btn-primary text-body-xs flex items-center gap-1.5"
              title={isEmpty ? 'JD cannot be empty' : undefined}
            >
              <Save size={13} />
              Save Role
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-hidden flex flex-col">
        <textarea
          value={content}
          onChange={function (e) { onChange?.(e.target.value); }}
          className="flex-1 w-full resize-y bg-transparent focus:outline-none"
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 13,
            lineHeight: 1.8,
            color: 'var(--brown)',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--cream-card)',
            padding: 16,
            minHeight: 400,
          }}
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
