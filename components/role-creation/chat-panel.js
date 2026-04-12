'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Link2 } from 'lucide-react';
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
  var [dismissedChips, setDismissedChips] = useState(new Set());
  var bottomRef = useRef(null);
  var inputRef = useRef(null);

  var ghostText = externalGhost || localGhost;

  // Scroll to bottom when messages change (including streaming content updates)
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
    // Mark this question's chips as dismissed
    if (currentQuestion?.id) {
      setDismissedChips(function (prev) {
        var next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });
    }
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
  var showChips = !isTyping
    && currentQuestion?.chips
    && messages.length > 0
    && messages[messages.length - 1]?.role === 'ai'
    && !dismissedChips.has(currentQuestion?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: compact ? '20px 20px' : '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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
              onOptionSelect={function (option) { onSend?.(option); }}
            />
          );
        })}

        {isTyping && <TypingIndicator />}

        {/* Chip suggestions */}
        {showChips && (
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

      {/* Input bar */}
      <div style={{
        padding: compact ? '10px 16px 14px' : '14px 20px 18px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream)',
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            padding: compact ? '8px 8px 8px 14px' : '10px 10px 10px 16px',
            borderRadius: compact ? 14 : 16,
            border: '1.5px solid var(--border-default)',
            backgroundColor: '#fff',
            transition: 'border-color 0.15s ease',
            minHeight: compact ? 46 : 54,
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
                fontSize: compact ? 13 : 14,
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
                fontSize: compact ? 13 : 14,
                color: 'var(--brown)',
                backgroundColor: 'transparent',
                padding: compact ? '6px 0' : '8px 0',
                opacity: isTyping ? 0.5 : 1,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!hasContent || isTyping}
            style={{
              width: compact ? 36 : 38,
              height: compact ? 36 : 38,
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
            <ArrowUp size={compact ? 14 : 15} />
          </button>
        </form>
      </div>
    </div>
  );
}
