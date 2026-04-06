'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Download, Link2, Check, X, Bold, Italic, List, Heading, Bookmark, Pencil, Eye } from 'lucide-react';

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

/* ── Markdown renderer components ── */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 26,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.25,
      marginBottom: 6,
      marginTop: 0,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.3,
      marginTop: 28,
      marginBottom: 10,
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.35,
      marginTop: 22,
      marginBottom: 8,
    }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.4,
      marginTop: 18,
      marginBottom: 6,
    }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--brown)',
      lineHeight: 1.7,
      marginTop: 0,
      marginBottom: 14,
    }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--brown)',
      lineHeight: 1.7,
      paddingLeft: 22,
      marginTop: 0,
      marginBottom: 14,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--brown)',
      lineHeight: 1.7,
      paddingLeft: 22,
      marginTop: 0,
      marginBottom: 14,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{
      marginBottom: 4,
    }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700, color: 'var(--brown)' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: 'var(--brown-muted)' }}>{children}</em>
  ),
  hr: () => (
    <hr style={{
      border: 'none',
      borderTop: '1px solid var(--border-light)',
      margin: '20px 0',
    }} />
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: 'var(--gold)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '3px solid var(--gold)',
      paddingLeft: 16,
      margin: '14px 0',
      color: 'var(--brown-muted)',
      fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
};

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
  var [editing, setEditing] = useState(false);
  var textareaRef = useRef(null);

  var wordCount = useMemo(function () {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  var isEmpty = !content.trim();

  // Focus textarea when entering edit mode
  useEffect(function () {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at end
      var len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  function insertMarkdown(prefix, suffix) {
    if (!editing) {
      setEditing(true);
      // Defer insertion until textarea is mounted
      setTimeout(function () {
        doInsert(prefix, suffix);
      }, 50);
      return;
    }
    doInsert(prefix, suffix);
  }

  function doInsert(prefix, suffix) {
    var textarea = textareaRef.current;
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
      {/* Tab header */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* Edit / Preview toggle */}
          <button
            onClick={function () { setEditing(!editing); }}
            title={editing ? 'Preview' : 'Edit markdown'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--border-default)',
              background: editing ? 'rgba(139,105,20,0.06)' : 'transparent',
              color: editing ? 'var(--gold)' : 'var(--brown-soft)',
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {editing ? <><Eye size={11} /> Preview</> : <><Pencil size={11} /> Edit</>}
          </button>
        </div>
      </div>

      {/* Formatting toolbar – visible when editing */}
      {editing && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 16px',
          borderBottom: '1px solid var(--border-light)',
          animation: 'fsd .1s ease',
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
      )}

      {/* Body – rendered markdown or edit textarea */}
      <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
        {editing ? (
          /* Edit mode: raw textarea */
          <textarea
            ref={textareaRef}
            value={content}
            onChange={function (e) { onChange?.(e.target.value); }}
            className="w-full h-full resize-none bg-transparent focus:outline-none"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.7, color: 'var(--brown)',
              padding: '20px 28px', border: 'none', backgroundColor: 'var(--cream-card)',
              minHeight: '100%', boxSizing: 'border-box',
            }}
            placeholder="Write your job description here..."
          />
        ) : (
          /* Preview mode: rendered rich text */
          <div
            style={{
              padding: '28px 32px 40px',
              cursor: isEmpty ? 'default' : 'text',
            }}
            onDoubleClick={function () { setEditing(true); }}
          >
            {isEmpty ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown-soft)',
                  marginBottom: 8,
                }}>
                  Your job description will appear here
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--brown-light)',
                }}>
                  Answer the questions on the left to generate it
                </p>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        )}
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
        flexShrink: 0,
      }}>
        <div className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
          {wordCount} words
          {editing && <span style={{ marginLeft: 8, color: 'var(--brown-light)' }}>· Editing</span>}
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
