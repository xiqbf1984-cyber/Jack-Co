'use client';

import { useState } from 'react';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .trim();
}

function parseMessage(content) {
  if (!content || typeof content !== 'string') return { text: '', ui: null };

  var uiMatch = content.match(/\[UI\]([\s\S]*?)\[\/UI\]/);
  var text = content.replace(/\[UI\][\s\S]*?\[\/UI\]/, '').trim();
  text = cleanText(text);

  var ui = null;
  if (uiMatch) {
    try { ui = JSON.parse(uiMatch[1]); } catch (e) { /* partial or malformed */ }
  }

  return { text: text, ui: ui };
}

/* ── Generative UI Components ── */

function OptionCard({ label, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={function () { onClick?.(label); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', textAlign: 'left',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        gap: 12,
      }}
      onMouseEnter={function (e) {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.backgroundColor = 'rgba(139,105,20,0.02)';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={function (e) {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.backgroundColor = '#fff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          color: 'var(--brown)', marginBottom: desc ? 2 : 0,
        }}>{label}</div>
        {desc && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--brown-soft)', lineHeight: 1.4,
          }}>{desc}</div>
        )}
      </div>
      <div style={{
        flexShrink: 0, padding: '4px 10px', borderRadius: 6,
        border: '1px solid var(--border-default)',
        fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
        color: 'var(--brown-soft)',
      }}>
        Select
      </div>
    </button>
  );
}

function ChipGroup({ title, items }) {
  return (
    <div>
      {title && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10,
          color: 'var(--brown-soft)', marginBottom: 6,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{title}</div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(items || []).map(function (item, i) {
          return (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: 14,
              backgroundColor: 'rgba(39,130,91,0.06)',
              border: '1px solid rgba(39,130,91,0.15)',
              fontFamily: 'var(--font-body)', fontSize: 11,
              color: 'var(--accent-green)',
            }}>{item}</span>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmBlock({ text, onConfirm }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 10,
      border: '1px solid var(--border-default)',
      backgroundColor: '#fff',
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13,
        color: 'var(--brown)', marginBottom: 10, lineHeight: 1.5,
      }}>{text}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={function () { onConfirm?.('Yes, that\'s right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--accent-green)',
            backgroundColor: 'rgba(39,130,91,0.06)',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--accent-green)', cursor: 'pointer',
          }}>Yes</button>
        <button type="button" onClick={function () { onConfirm?.('No, that\'s not right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--border-default)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--brown-soft)', cursor: 'pointer',
          }}>No</button>
      </div>
    </div>
  );
}

function InlineInput({ placeholder, onSubmit }) {
  var [val, setVal] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    if (val.trim()) { onSubmit?.(val.trim()); setVal(''); }
  }
  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', gap: 8, alignItems: 'center',
    }}>
      <input
        value={val} onChange={function (e) { setVal(e.target.value); }}
        placeholder={placeholder || 'Or type your own...'}
        style={{
          flex: 1, padding: '8px 12px', borderRadius: 8,
          border: '1px solid var(--border-default)',
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'var(--brown)', backgroundColor: '#fff',
          outline: 'none',
        }}
        onFocus={function (e) { e.currentTarget.style.borderColor = 'var(--gold)'; }}
        onBlur={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
      />
      {val.trim() && (
        <button type="submit" style={{
          padding: '6px 12px', borderRadius: 7,
          border: 'none', backgroundColor: 'var(--brown)',
          fontFamily: 'var(--font-body)', fontSize: 11,
          color: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>Send</button>
      )}
    </form>
  );
}

/* ── Main Component ── */

export default function ChatBubble({ role, content, animate = false, compact = false, onOptionSelect }) {
  var isAI = role === 'ai';

  if (!isAI) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        animation: animate ? 'fsu 0.2s ease both' : 'none',
      }}>
        <div style={{
          padding: compact ? '8px 14px' : '10px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: compact ? 12 : 13,
          lineHeight: 1.6,
          borderRadius: '14px 4px 14px 14px',
          background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
          color: 'var(--cream)',
          maxWidth: '80%',
          wordBreak: 'break-word',
        }}>
          {content}
        </div>
      </div>
    );
  }

  // AI message — parse for [UI] blocks
  var parsed = parseMessage(content);

  // Check if we're mid-stream (content changing, UI block not complete yet)
  var isStreaming = content && !content.includes('[/UI]') && content.includes('[UI]');
  var displayText = isStreaming
    ? content.replace(/\[UI\][\s\S]*$/, '').trim()
    : parsed.text;
  displayText = cleanText(displayText);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      animation: animate ? 'fsu 0.2s ease both' : 'none',
      maxWidth: '94%',
    }}>
      {/* Text portion */}
      {displayText && (
        <div style={{
          padding: compact ? '8px 14px' : '10px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: compact ? 12 : 13,
          lineHeight: 1.6,
          borderRadius: '4px 14px 14px 14px',
          backgroundColor: 'var(--cream-sidebar)',
          color: 'var(--brown)',
          wordBreak: 'break-word',
        }}>
          {displayText}
        </div>
      )}

      {/* Generative UI components — only render when complete */}
      {parsed.ui && parsed.ui.components && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'fsu 0.2s ease both',
        }}>
          {parsed.ui.components.map(function (comp, idx) {
            if (comp.type === 'options') {
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {comp.title && (
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 10,
                      color: 'var(--brown-soft)', marginBottom: 2,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{comp.title}</div>
                  )}
                  {(comp.items || []).map(function (item, oidx) {
                    return (
                      <OptionCard
                        key={oidx}
                        label={item.label}
                        desc={item.desc}
                        onClick={function (val) { onOptionSelect?.(val); }}
                      />
                    );
                  })}
                </div>
              );
            }

            if (comp.type === 'chips') {
              return <ChipGroup key={idx} title={comp.title} items={comp.items} />;
            }

            if (comp.type === 'confirm') {
              return <ConfirmBlock key={idx} text={comp.text} onConfirm={onOptionSelect} />;
            }

            if (comp.type === 'input') {
              return <InlineInput key={idx} placeholder={comp.placeholder} onSubmit={onOptionSelect} />;
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
