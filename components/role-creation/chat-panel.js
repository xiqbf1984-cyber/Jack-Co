'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatBubble from './chat-bubble';
import TypingIndicator from './typing-indicator';
import ChipSuggestions from './chip-suggestions';

export default function ChatPanel({
  messages = [],
  onSend,
  currentQuestion,
  isTyping,
  compact = false,
  ghostText: externalGhost = '',
  onGhostChange,
}) {
  var [input, setInput] = useState('');
  var [localGhost, setLocalGhost] = useState('');
  var bottomRef = useRef(null);
  var inputRef = useRef(null);

  var ghostText = externalGhost || localGhost;

  useEffect(function () {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(function () {
    if (input) {
      setLocalGhost('');
      onGhostChange?.('');
    }
  }, [input, onGhostChange]);

  function handleSubmit(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput('');
    setLocalGhost('');
  }

  function handleChip(chip) {
    onSend?.(chip);
    setInput('');
    setLocalGhost('');
  }

  function handleChipHover(chip) {
    if (!input) {
      setLocalGhost(chip || '');
    }
  }

  var hasContent = input.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: compact ? '20px 20px' : '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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

        {/* Chip suggestions — wrapped, not scrolling */}
        {!isTyping && currentQuestion?.chips && messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && (
          <div style={{
            marginLeft: compact ? 36 : 40,
            marginTop: 4,
          }}>
            <ChipSuggestions
              chips={currentQuestion.chips}
              onSelect={handleChip}
              onHover={handleChipHover}
              compact={compact}
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — larger and more prominent */}
      <div style={{
        padding: '12px 20px 16px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 8px 8px 16px',
            borderRadius: 14,
            border: '1.5px solid var(--border-default)',
            backgroundColor: '#fff',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            {ghostText && !input && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown-light)',
                opacity: 0.35,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
              }}>
                {ghostText}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={function (e) { setInput(e.target.value); }}
              placeholder={ghostText ? '' : 'Type your answer...'}
              disabled={isTyping}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                backgroundColor: 'transparent',
                padding: '6px 0',
                opacity: isTyping ? 0.5 : 1,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!hasContent || isTyping}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              flexShrink: 0,
              background: hasContent
                ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                : 'var(--cream)',
              color: hasContent ? '#fff' : 'var(--brown-light)',
              cursor: hasContent ? 'pointer' : 'default',
              opacity: isTyping ? 0.4 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
