'use client';

import { useMemo, useState, useCallback } from 'react';
import { Save, Link2, Check, X, Bold, Italic, List, Heading } from 'lucide-react';

function CopyLinkModal({ link, onClose }) {
  var [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(link).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(26,22,18,0.35)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '24px', width: '100%', maxWidth: 420,
        boxShadow: 'var(--shadow-modal)', animation: 'fadeScale 0.2s ease both',
      }} onClick={function (e) { e.stopPropagation(); }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--brown)' }}>Share this JD</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brown-soft)', padding: 4 }}><X size={16} /></button>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 14, lineHeight: 1.5 }}>
          Share this link with candidates or colleagues to view the job description.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            readOnly value={link}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border-default)',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', background: 'var(--cream)',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={function (e) { e.target.select(); }}
          />
          <button onClick={handleCopy} className="btn-primary" style={{ padding: '10px 18px', fontSize: 12, flexShrink: 0 }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JDCanvas({
  content = '',
  onChange,
  onSave,
  matchedRoleName,
  matchScore,
  sharableLink,
}) {
  var [showLinkModal, setShowLinkModal] = useState(false);

  var wordCount = useMemo(function () {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  var isEmpty = !content.trim();

  function insertMarkdown(prefix, suffix) {
    var textarea = document.querySelector('#jd-textarea');
    if (!textarea) return;
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var text = content;
    var selected = text.slice(start, end);
    var replacement = prefix + selected + (suffix || '');
    var newText = text.slice(0, start) + replacement + text.slice(end);
    onChange?.(newText);
    // Restore cursor position after React re-render
    setTimeout(function () {
      textarea.focus();
      var newPos = start + replacement.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

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
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 700, color: 'var(--brown)' }}>
            Job Description
          </h2>
          {matchedRoleName && (
            <div className="flex items-center gap-1 mt-1" style={{
              fontFamily: 'var(--font-body)', fontSize: 10,
              color: matchScore > 0 ? 'var(--accent-green)' : 'var(--brown-muted)',
            }}>
              {matchScore > 0 ? (
                <>
                  <Check size={10} strokeWidth={2.5} />
                  Matched: {matchedRoleName}
                </>
              ) : 'No strong match found'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sharableLink && (
            <button
              type="button"
              onClick={function () { setShowLinkModal(true); }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-body-xs rounded-lg transition-all hover-bg-cream"
              style={{ border: '1px solid var(--border-default)', color: 'var(--brown-muted)' }}
            >
              <Link2 size={12} />
              Copy link
            </button>
          )}
          {onSave && (
            <button
              type="button" onClick={onSave} disabled={isEmpty}
              className="btn-primary text-body-xs flex items-center gap-1.5"
              title={isEmpty ? 'JD cannot be empty' : undefined}
            >
              <Save size={13} />
              Save Role
            </button>
          )}
        </div>
      </div>

      {/* Formatting toolbar */}
      <div style={{
        display: 'flex', gap: 2, padding: '6px 20px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        {[
          { icon: Heading, action: function () { insertMarkdown('## ', ''); }, title: 'Heading' },
          { icon: Bold, action: function () { insertMarkdown('**', '**'); }, title: 'Bold' },
          { icon: Italic, action: function () { insertMarkdown('*', '*'); }, title: 'Italic' },
          { icon: List, action: function () { insertMarkdown('- ', ''); }, title: 'List' },
        ].map(function (tool) {
          var Icon = tool.icon;
          return (
            <button key={tool.title} type="button" onClick={tool.action} title={tool.title}
              style={{
                width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--brown-soft)', transition: 'all 0.1s ease',
              }}
              onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--cream)'; e.currentTarget.style.color = 'var(--brown)'; }}
              onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--brown-soft)'; }}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-hidden flex flex-col">
        <textarea
          id="jd-textarea"
          value={content}
          onChange={function (e) { onChange?.(e.target.value); }}
          className="flex-1 w-full resize-y bg-transparent focus:outline-none"
          style={{
            fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.8, color: 'var(--brown)',
            borderRadius: 12, border: '1px solid var(--border-default)', backgroundColor: 'var(--cream-card)',
            padding: 16, minHeight: 400,
          }}
          placeholder="Your job description will appear here..."
        />
      </div>

      {/* Footer */}
      <div className="px-5 py-2 text-body-xs" style={{ borderTop: '1px solid var(--border-light)', color: 'var(--brown-soft)' }}>
        {wordCount} words
      </div>

      {/* Link sharing modal */}
      {showLinkModal && sharableLink && (
        <CopyLinkModal link={sharableLink} onClose={function () { setShowLinkModal(false); }} />
      )}
    </div>
  );
}
