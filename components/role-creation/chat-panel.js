'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import ChatBubble, { parseUIBlock } from './chat-bubble';
import TypingIndicator from './typing-indicator';

/* ── Bottom Dock UI Components ── */

function DockOptionCard({ label, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={function () { onClick?.(label); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', textAlign: 'left',
        padding: '10px 14px', borderRadius: 10,
        border: '1px solid var(--border-default)',
        backgroundColor: '#fff', cursor: 'pointer',
        transition: 'all 0.15s ease', gap: 12,
      }}
      onMouseEnter={function (e) {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.backgroundColor = 'rgba(139,105,20,0.02)';
      }}
      onMouseLeave={function (e) {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.backgroundColor = '#fff';
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
      }}>Select</div>
    </button>
  );
}

function DockChips({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div style={{ padding: '0 2px' }}>
      {title && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10,
          color: 'var(--brown-soft)', marginBottom: 6,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{title}</div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map(function (item, i) {
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

function DockConfirm({ text, onSelect }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 10,
      border: '1px solid var(--border-default)', backgroundColor: '#fff',
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13,
        color: 'var(--brown)', marginBottom: 10, lineHeight: 1.5,
      }}>{text}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={function () { onSelect?.('Yes, that\'s right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--accent-green)',
            backgroundColor: 'rgba(39,130,91,0.06)',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--accent-green)', cursor: 'pointer',
          }}>Yes</button>
        <button type="button" onClick={function () { onSelect?.('No, that\'s not right'); }}
          style={{
            padding: '5px 14px', borderRadius: 7,
            border: '1px solid var(--border-default)', backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: 'var(--brown-soft)', cursor: 'pointer',
          }}>No</button>
      </div>
    </div>
  );
}

function DockPasteArea({ placeholder, onSubmit }) {
  var [val, setVal] = useState('');
  return (
    <div style={{
      border: '1px solid var(--border-default)', borderRadius: 10,
      backgroundColor: '#fff', overflow: 'hidden',
    }}>
      <textarea
        value={val}
        onChange={function (e) { setVal(e.target.value); }}
        placeholder={placeholder || 'Paste your content here...'}
        rows={3}
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

/* ── Render the bottom dock from [UI] components ── */

function BottomDock({ ui, onSelect, compact }) {
  if (!ui || !ui.components || !ui.components.length) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      animation: 'fsu 0.2s ease both',
    }}>
      {ui.components.map(function (comp, idx) {
        if (comp.type === 'options') {
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {comp.title && (
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 10,
                  color: 'var(--brown-soft)',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>{comp.title}</div>
              )}
              {(comp.items || []).map(function (item, oidx) {
                return <DockOptionCard key={oidx} label={item.label} desc={item.desc} onClick={onSelect} />;
              })}
            </div>
          );
        }
        if (comp.type === 'chips') return <DockChips key={idx} title={comp.title} items={comp.items} />;
        if (comp.type === 'confirm') return <DockConfirm key={idx} text={comp.text} onSelect={onSelect} />;
        if (comp.type === 'paste') return <DockPasteArea key={idx} placeholder={comp.placeholder} onSubmit={onSelect} />;
        // 'input' type is handled by the main text input below
        return null;
      })}
    </div>
  );
}

/* ── Main ChatPanel ── */

export default function ChatPanel({
  messages = [],
  onSend,
  currentQuestion,
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

  // Find placeholder from UI input component
  var inputPlaceholder = 'Type your answer...';
  if (latestUI && latestUI.components) {
    for (var c = 0; c < latestUI.components.length; c++) {
      if (latestUI.components[c].type === 'input' && latestUI.components[c].placeholder) {
        inputPlaceholder = latestUI.components[c].placeholder;
        break;
      }
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

      {/* Bottom dock — dynamic UI zone */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
        padding: compact ? '10px 16px 12px' : '12px 20px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
        maxHeight: '50vh', overflowY: 'auto',
      }}>
        {/* Generative UI components from latest AI message */}
        {latestUI && (
          <BottomDock ui={latestUI} onSelect={handleDockSelect} compact={compact} />
        )}

        {/* Text input — always present */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            padding: compact ? '8px 8px 8px 14px' : '8px 8px 8px 14px',
            borderRadius: 12,
            border: '1.5px solid var(--border-default)',
            backgroundColor: '#fff',
            transition: 'border-color 0.15s ease',
            minHeight: 44,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={function (e) { setInput(e.target.value); }}
            placeholder={inputPlaceholder}
            disabled={isTyping}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: compact ? 13 : 13,
              color: 'var(--brown)', backgroundColor: 'transparent',
              padding: '6px 0',
              opacity: isTyping ? 0.5 : 1,
            }}
          />
          <button
            type="submit"
            disabled={!hasContent || isTyping}
            style={{
              width: 32, height: 32, borderRadius: '50%',
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
            <ArrowUp size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
