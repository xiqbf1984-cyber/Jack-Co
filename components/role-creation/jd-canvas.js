'use client';

import { useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Save, Download, Link2, Check, X, Bold, Italic, List, Heading, Bookmark } from 'lucide-react';

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
  onSaveForLater,
  matchedRoleName,
  matchScore,
  sharableLink,
  portalTarget,
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
    setTimeout(function () {
      textarea.focus();
      var newPos = start + replacement.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  function handleDownload() {
    if (isEmpty) return;
    var blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (matchedRoleName || 'job-description').replace(/\s+/g, '-').toLowerCase() + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {/* Tab header – single "JD" tab */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--cream)',
          minHeight: 44,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{
            padding: '10px 16px',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--brown)',
            borderBottom: '2px solid var(--gold)',
            marginBottom: -1,
            cursor: 'default',
          }}>
            Job Description
          </div>
        </div>

        {/* Matched role indicator */}
        {matchedRoleName && matchScore > 0 && (
          <div className="flex items-center gap-1" style={{
            fontFamily: 'var(--font-body)', fontSize: 10,
            color: 'var(--accent-green)',
          }}>
            <Check size={10} strokeWidth={2.5} />
            Matched: {matchedRoleName}
          </div>
        )}
      </div>

      {/* Formatting toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 16px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', gap: 2 }}>
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
      </div>

      {/* Body – editable JD */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <textarea
          id="jd-textarea"
          value={content}
          onChange={function (e) { onChange?.(e.target.value); }}
          className="flex-1 w-full resize-y bg-transparent focus:outline-none"
          style={{
            fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.8, color: 'var(--brown)',
            borderRadius: 12, border: '1px solid var(--border-default)', backgroundColor: 'var(--cream-card)',
            padding: 16, minHeight: 300,
          }}
          placeholder="Your job description will appear here..."
        />
      </div>

      {/* Footer with word count + action buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px 12px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
        gap: 8,
      }}>
        <div className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
          {wordCount} words
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isEmpty}
            title="Download as Markdown"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: 'transparent',
              color: isEmpty ? 'var(--brown-light)' : 'var(--brown-soft)',
              fontFamily: 'var(--font-body)', fontSize: 11,
              cursor: isEmpty ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
              opacity: isEmpty ? 0.5 : 1,
            }}
          >
            <Download size={13} />
            Download
          </button>

          {/* Copy link */}
          {sharableLink && (
            <button
              type="button"
              onClick={function () { setShowLinkModal(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: 'transparent',
                color: 'var(--brown-soft)',
                fontFamily: 'var(--font-body)', fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Link2 size={13} />
              Share
            </button>
          )}

          {/* Save for later */}
          {onSaveForLater && (
            <button
              type="button"
              onClick={onSaveForLater}
              disabled={isEmpty}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: 'transparent',
                color: isEmpty ? 'var(--brown-light)' : 'var(--brown-soft)',
                fontFamily: 'var(--font-body)', fontSize: 11,
                cursor: isEmpty ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                opacity: isEmpty ? 0.5 : 1,
              }}
            >
              <Bookmark size={13} />
              Save for Later
            </button>
          )}

          {/* Save Role (primary) */}
          {onSave && (
            <button
              type="button" onClick={onSave} disabled={isEmpty}
              className="btn-primary text-body-xs flex items-center gap-1.5"
              style={{ padding: '7px 16px', opacity: isEmpty ? 0.5 : 1 }}
              title={isEmpty ? 'JD cannot be empty' : 'Save and finalize this role'}
            >
              <Save size={13} />
              Save Role
            </button>
          )}
        </div>
      </div>

      {/* Link sharing modal – portal to body to escape split layout clipping */}
      {showLinkModal && sharableLink && portalTarget &&
        createPortal(
          <CopyLinkModal link={sharableLink} onClose={function () { setShowLinkModal(false); }} />,
          portalTarget
        )}
      {showLinkModal && sharableLink && !portalTarget && (
        <CopyLinkModal link={sharableLink} onClose={function () { setShowLinkModal(false); }} />
      )}
    </div>
  );
}
