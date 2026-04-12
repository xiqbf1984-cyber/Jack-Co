'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import ChatBubble, { parseUIBlock } from './chat-bubble';
import TypingIndicator from './typing-indicator';

/* ── Dock Components ── */

function DockOptionCard({ label, desc, onClick, isLast }) {
  return (
    <button
      type="button"
      onClick={function () { onClick?.(label); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', textAlign: 'left',
        padding: '10px 14px',
        border: '1px solid var(--border-default)',
        borderTop: 'none',
        borderRadius: 0,
        backgroundColor: '#fff', cursor: 'pointer',
        transition: 'all 0.12s ease', gap: 12,
      }}
      onMouseEnter={function (e) {
        e.currentTarget.style.backgroundColor = 'rgba(139,105,20,0.03)';
      }}
      onMouseLeave={function (e) {
        e.currentTarget.style.backgroundColor = '#fff';
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
          color: 'var(--brown)',
        }}>{label}</div>
        {desc && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--brown-soft)', lineHeight: 1.4, marginTop: 1,
          }}>{desc}</div>
        )}
      </div>
      <div style={{
        flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: 10,
        color: 'var(--brown-light)',
      }}>Select</div>
    </button>
  );
}

function DockChips({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div style={{ padding: '4px 0' }}>
      {title && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10,
          color: 'var(--brown-soft)', marginBottom: 6,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{title}</div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {items.map(function (item, i) {
          return (
            <span key={i} style={{
              padding: '3px 9px', borderRadius: 12,
              backgroundColor: 'rgba(39,130,91,0.06)',
              border: '1px solid rgba(39,130,91,0.12)',
              fontFamily: 'var(--font-body)', fontSize: 11,
              color: 'var(--accent-green)',
            }}>{item}</span>
          );
        })}
      </div>
    </div>
  );
}

function DockConfirm({ text, onSelect }) {
  return (
    <div style={{
      padding: '10px 14px',
      border: '1px solid var(--border-default)',
      borderRadius: 10, backgroundColor: '#fff',
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13,
        color: 'var(--brown)', marginBottom: 8, lineHeight: 1.5,
      }}>{text}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={function () { onSelect?.('Yes, that\'s right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--border-default)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--brown-soft)', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={function (e) {
            e.currentTarget.style.borderColor = 'var(--accent-green)';
            e.currentTarget.style.backgroundColor = 'rgba(39,130,91,0.06)';
            e.currentTarget.style.color = 'var(--accent-green)';
          }}
          onMouseLeave={function (e) {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--brown-soft)';
          }}
        >Yes</button>
        <button type="button" onClick={function () { onSelect?.('No, that\'s not right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--border-default)', backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--brown-soft)', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={function (e) {
            e.currentTarget.style.borderColor = 'var(--red)';
            e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.04)';
            e.currentTarget.style.color = 'var(--red)';
          }}
          onMouseLeave={function (e) {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--brown-soft)';
          }}
        >No</button>
      </div>
    </div>
  );
}

function DockPasteArea({ placeholder, onSubmit }) {
  var [val, setVal] = useState('');
  return (
    <div style={{
      border: '1px solid var(--border-default)',
      borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden',
    }}>
      <textarea
        value={val}
        onChange={function (e) { setVal(e.target.value); }}
        placeholder={placeholder || 'Paste here...'}
        rows={4}
        style={{
          width: '100%', padding: '10px 14px', border: 'none', outline: 'none',
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
          backgroundColor: 'transparent', resize: 'none', boxSizing: 'border-box',
        }}
      />
      {val.trim() && (
        <div style={{ padding: '0 10px 10px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={function () { onSubmit?.(val.trim()); setVal(''); }}
            style={{
              padding: '5px 14px', borderRadius: 7, border: 'none',
              backgroundColor: 'var(--brown)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 11, cursor: 'pointer',
            }}>Submit</button>
        </div>
      )}
    </div>
  );
}

/* ── Main ChatPanel ── */

export default function ChatPanel({
  messages = [],
  onSend,
  isTyping,
  compact = false,
}) {
  var [input, setInput] = useState('');
  var bottomRef = useRef(null);
  var inputRef = useRef(null);

  // Scroll on content changes
  var lastContentLen = useRef(0);
  useEffect(function () {
    var totalLen = messages.reduce(function (sum, m) { return sum + (m.content || '').length; }, 0);
    if (totalLen !== lastContentLen.current) {
      lastContentLen.current = totalLen;
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  });
  useEffect(function () {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping]);

  function handleSubmit(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput('');
  }

  function handleDockSelect(value) {
    onSend?.(value);
  }

  // Extract UI block from the latest AI message
  var latestUI = null;
  if (!isTyping && messages.length > 0) {
    var lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'ai') {
      latestUI = parseUIBlock(lastMsg.content);
    }
  }

  // Check if there are options in the UI
  var hasOptions = false;
  var hasPaste = false;
  var hasConfirm = false;
  if (latestUI && latestUI.components) {
    for (var c = 0; c < latestUI.components.length; c++) {
      if (latestUI.components[c].type === 'options') hasOptions = true;
      if (latestUI.components[c].type === 'paste') hasPaste = true;
      if (latestUI.components[c].type === 'confirm') hasConfirm = true;
    }
  }

  var hasContent = input.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: compact ? '20px 20px' : '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 14,
        minWidth: 0,
      }}>
        {messages.map(function (msg, i) {
          return (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              animate={i === messages.length - 1}
              compact={compact}
            />
          );
        })}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Bottom dock — unified input zone */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
        padding: compact ? '10px 16px 12px' : '12px 20px 16px',
        maxHeight: '55vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Chips (confirmed facts) */}
        {latestUI && latestUI.components && latestUI.components.map(function (comp, idx) {
          if (comp.type === 'chips') return <DockChips key={idx} title={comp.title} items={comp.items} />;
          return null;
        })}

        {/* CONFIRM — shows alone, no other interactive elements */}
        {hasConfirm && latestUI.components.map(function (comp, idx) {
          if (comp.type === 'confirm') return <DockConfirm key={idx} text={comp.text} onSelect={handleDockSelect} />;
          return null;
        })}

        {/* PASTE — shows alone with its own input */}
        {!hasConfirm && hasPaste && latestUI.components.map(function (comp, idx) {
          if (comp.type === 'paste') return <DockPasteArea key={idx} placeholder={comp.placeholder} onSubmit={handleDockSelect} />;
          return null;
        })}

        {/* OPTIONS + text input as connected card stack (only if no confirm/paste) */}
        {!hasConfirm && !hasPaste && (
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid var(--border-default)',
            backgroundColor: '#fff',
          }}>
            {hasOptions && latestUI.components.map(function (comp, idx) {
              if (comp.type !== 'options') return null;
              return (
                <div key={idx}>
                  {comp.title && (
                    <div style={{
                      padding: '8px 14px 4px',
                      fontFamily: 'var(--font-body)', fontSize: 10,
                      color: 'var(--brown-soft)',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{comp.title}</div>
                  )}
                  {(comp.items || []).map(function (item, oidx) {
                    return <DockOptionCard key={oidx} label={item.label} desc={item.desc} onClick={handleDockSelect} />;
                  })}
                </div>
              );
            })}

            {hasOptions && (
              <div style={{ borderTop: '1px solid var(--border-light)' }} />
            )}

            {/* Text input — connected to the bottom of the card stack */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={function (e) { setInput(e.target.value); }}
                placeholder={hasOptions ? 'Or type something else...' : 'Type your answer...'}
                disabled={isTyping}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'var(--brown)', backgroundColor: 'transparent',
                  padding: '4px 0',
                  opacity: isTyping ? 0.5 : 1,
                }}
              />
              <button
                type="submit"
                disabled={!hasContent || isTyping}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', flexShrink: 0,
                  background: hasContent
                    ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                    : 'var(--cream)',
                  color: hasContent ? '#fff' : 'var(--brown-light)',
                  cursor: hasContent ? 'pointer' : 'default',
                  opacity: isTyping ? 0.4 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowUp size={13} />
              </button>
            </form>
          </div>
        )}

        {/* If paste mode, show a separate simple text input below */}
        {hasPaste && (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', marginTop: 8,
              borderRadius: 10, border: '1px solid var(--border-default)',
              backgroundColor: '#fff',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={function (e) { setInput(e.target.value); }}
              placeholder="Or describe what's in it..."
              disabled={isTyping}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--brown)', backgroundColor: 'transparent',
                padding: '4px 0',
              }}
            />
            <button type="submit" disabled={!hasContent || isTyping}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', flexShrink: 0,
                background: hasContent
                  ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                  : 'var(--cream)',
                color: hasContent ? '#fff' : 'var(--brown-light)',
                cursor: hasContent ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
            ><ArrowUp size={13} /></button>
          </form>
        )}
      </div>
    </div>
  );
}
