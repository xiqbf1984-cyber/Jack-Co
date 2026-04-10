'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Bold, Italic, List, Heading, Pencil, Eye } from 'lucide-react';
import HiringBriefView from './hiring-brief-view';

/* ── Markdown renderer components ── */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 style={{
      fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700,
      color: 'var(--brown)', lineHeight: 1.3, marginBottom: 4, marginTop: 0,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700,
      color: 'var(--brown)', lineHeight: 1.35, marginTop: 22, marginBottom: 8,
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
      color: 'var(--brown)', lineHeight: 1.4, marginTop: 18, marginBottom: 6,
    }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
      color: 'var(--brown)', lineHeight: 1.4, marginTop: 14, marginBottom: 4,
    }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
      lineHeight: 1.7, marginTop: 0, marginBottom: 12,
    }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{
      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
      lineHeight: 1.7, paddingLeft: 20, marginTop: 0, marginBottom: 12,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
      lineHeight: 1.7, paddingLeft: 20, marginTop: 0, marginBottom: 12,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 3 }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700, color: 'var(--brown)' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: 'var(--brown-muted)' }}>{children}</em>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: 'var(--gold)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '3px solid var(--gold)', paddingLeft: 14,
      margin: '12px 0', color: 'var(--brown-muted)', fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
};

export default function JDCanvas({
  content = '',
  onChange,
  hiringBrief,
  onHiringBriefChange,
  matchedRoleName,
  matchScore,
}) {
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

  var TABS = [
    { key: 'jd', label: 'Job Description' },
    { key: 'brief', label: 'Hiring Brief' },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden animate-canvas-in"
      style={{ backgroundColor: 'var(--cream-card)' }}
    >
      {/* Tab bar — just tabs, no buttons */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-light)',
        minHeight: 40, flexShrink: 0,
      }}>
        {TABS.map(function (tab) {
          var isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={function () { setActiveTab(tab.key); }}
              style={{
                padding: '10px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
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

      {/* JD Tab Content */}
      {activeTab === 'jd' && (
        <>
          {/* Sub-header: matched role + word count + edit toggle + formatting */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 16px',
            borderBottom: '1px solid var(--border-light)',
            minHeight: 30, flexShrink: 0,
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

          {/* Body */}
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
    </div>
  );
}
