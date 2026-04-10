'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Download, Link2, Check, X, Bold, Italic, List, Heading, Pencil, Eye, Plus } from 'lucide-react';
import HiringBriefView from './hiring-brief-view';

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
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.3,
      marginBottom: 4,
      marginTop: 0,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.35,
      marginTop: 22,
      marginBottom: 8,
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.4,
      marginTop: 18,
      marginBottom: 6,
    }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--brown)',
      lineHeight: 1.4,
      marginTop: 14,
      marginBottom: 4,
    }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--brown)',
      lineHeight: 1.7,
      marginTop: 0,
      marginBottom: 12,
    }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--brown)',
      lineHeight: 1.7,
      paddingLeft: 20,
      marginTop: 0,
      marginBottom: 12,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--brown)',
      lineHeight: 1.7,
      paddingLeft: 20,
      marginTop: 0,
      marginBottom: 12,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{
      marginBottom: 3,
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
      margin: '16px 0',
    }} />
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: 'var(--gold)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '3px solid var(--gold)',
      paddingLeft: 14,
      margin: '12px 0',
      color: 'var(--brown-muted)',
      fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
};

/* ── Shared button style helper ── */
function actionBtnStyle(disabled) {
  return {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 12px', borderRadius: 7,
    border: '1px solid var(--border-default)',
    background: 'transparent',
    color: disabled ? 'var(--brown-light)' : 'var(--brown-soft)',
    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
  };
}

export default function JDCanvas({
  content = '',
  onChange,
  onSave,
  onCreateAssessment,
  hiringBrief,
  onHiringBriefChange,
  matchedRoleName,
  matchScore,
  sharableLink,
  portalTarget,
}) {
  var [showLinkModal, setShowLinkModal] = useState(false);
  var [editing, setEditing] = useState(false);
  var [activeTab, setActiveTab] = useState('jd');
  var textareaRef = useRef(null);

  var wordCount = useMemo(function () {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  var isEmpty = !content.trim();

  useEffect(function () {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      var len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  function insertMarkdown(prefix, suffix) {
    if (!editing) {
      setEditing(true);
      setTimeout(function () { doInsert(prefix, suffix); }, 50);
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

  var TABS = [
    { key: 'jd', label: 'Job Description' },
    { key: 'brief', label: 'Hiring Brief' },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden animate-canvas-in"
      style={{ backgroundColor: 'var(--cream-card)' }}
    >
      {/* Tab header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
        minHeight: 42, flexShrink: 0,
      }}>
        {/* Left: Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {TABS.map(function (tab) {
            var isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={function () { setActiveTab(tab.key); }}
                style={{
                  padding: '11px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--brown)' : 'var(--brown-soft)',
                  marginBottom: -1,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: All action buttons in one row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Download */}
          <button type="button" onClick={handleDownload} disabled={isEmpty} title="Download" style={actionBtnStyle(isEmpty)}>
            <Download size={12} />
          </button>

          {/* Share */}
          {sharableLink && (
            <button type="button" onClick={function () { setShowLinkModal(true); }} title="Share" style={actionBtnStyle(false)}>
              <Link2 size={12} />
            </button>
          )}

          {/* Save */}
          {onSave && (
            <button type="button" onClick={onSave} disabled={isEmpty} style={actionBtnStyle(isEmpty)}>
              <Save size={12} />
              Save
            </button>
          )}

          {/* Create an Assessment */}
          {onCreateAssessment && (
            <button
              type="button"
              onClick={onCreateAssessment}
              disabled={isEmpty}
              className="btn-primary"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', fontSize: 11,
                opacity: isEmpty ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={12} />
              Create an Assessment
            </button>
          )}
        </div>
      </div>

      {/* JD Tab Content */}
      {activeTab === 'jd' && (
        <>
          {/* Sub-header: Edit/Preview toggle + matched role + word count */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 16px',
            borderBottom: '1px solid var(--border-light)',
            minHeight: 32, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {matchedRoleName && matchScore > 0 && (
                <div className="flex items-center gap-1" style={{
                  fontFamily: 'var(--font-body)', fontSize: 10,
                  color: 'var(--accent-green)',
                }}>
                  <Check size={9} strokeWidth={2.5} />
                  {matchedRoleName}
                </div>
              )}
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)' }}>
                {wordCount} words
                {editing && <span style={{ marginLeft: 6 }}>· Editing</span>}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Formatting tools — inline when editing */}
              {editing && (
                <>
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
                          width: 24, height: 24, borderRadius: 5, border: 'none', background: 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--brown-light)', transition: 'all 0.1s ease',
                        }}
                        onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--cream)'; e.currentTarget.style.color = 'var(--brown)'; }}
                        onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--brown-light)'; }}
                      >
                        <Icon size={12} />
                      </button>
                    );
                  })}
                  <div style={{ width: 1, height: 14, backgroundColor: 'var(--border-light)', margin: '0 4px' }} />
                </>
              )}

              <button
                onClick={function () { setEditing(!editing); }}
                title={editing ? 'Preview' : 'Edit markdown'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 5,
                  border: '1px solid var(--border-default)',
                  background: editing ? 'rgba(139,105,20,0.06)' : 'transparent',
                  color: editing ? 'var(--gold)' : 'var(--brown-soft)',
                  fontFamily: 'var(--font-body)', fontSize: 10,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {editing ? <><Eye size={10} /> Preview</> : <><Pencil size={10} /> Edit</>}
              </button>
            </div>
          </div>

          {/* Body – rendered markdown or edit textarea */}
          <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
            {editing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={function (e) { onChange?.(e.target.value); }}
                className="w-full h-full resize-none bg-transparent focus:outline-none"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.7, color: 'var(--brown)',
                  padding: '16px 24px', border: 'none', backgroundColor: 'var(--cream-card)',
                  minHeight: '100%', boxSizing: 'border-box',
                }}
                placeholder="Write your job description here..."
              />
            ) : (
              <div
                style={{
                  padding: '20px 24px 32px',
                  cursor: isEmpty ? 'default' : 'text',
                }}
                onDoubleClick={function () { setEditing(true); }}
              >
                {isEmpty ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'var(--brown-soft)', marginBottom: 6,
                    }}>
                      Your job description will appear here
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 11,
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
        </>
      )}

      {/* Hiring Brief Tab Content */}
      {activeTab === 'brief' && (
        <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
          <HiringBriefView hiringBrief={hiringBrief} onChange={onHiringBriefChange} />
        </div>
      )}

      {/* Link sharing modal */}
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
