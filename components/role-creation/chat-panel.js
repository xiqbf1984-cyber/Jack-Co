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

  // Clear ghost when user types
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
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
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

        {/* Chip suggestions after the last AI message */}
        {!isTyping && currentQuestion?.chips && messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && (
          <div className={compact ? 'ml-9 mt-0.5' : 'ml-9 mt-1'}>
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
      <div className="px-5 pb-4 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            {/* Ghost text */}
            {ghostText && !input && (
              <div
                className="absolute inset-0 px-4 flex items-center pointer-events-none text-body-sm"
                style={{ color: 'var(--brown-light)', opacity: 0.4 }}
              >
                <span className="truncate">{ghostText}</span>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={function (e) { setInput(e.target.value); }}
              placeholder={ghostText ? '' : 'Type your answer...'}
              disabled={isTyping}
              className="w-full px-4 py-2.5 text-body-sm focus:outline-none focus-border-hover transition-colors disabled:opacity-50"
              style={{
                borderRadius: 24,
                border: '1.5px solid var(--border-default)',
                backgroundColor: 'var(--cream-card)',
                color: 'var(--brown)',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!hasContent || isTyping}
            className="flex items-center justify-center rounded-full transition-all shrink-0"
            style={{
              width: 34,
              height: 34,
              background: hasContent
                ? 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))'
                : 'var(--cream-sidebar)',
              color: hasContent ? 'var(--btn-text)' : 'var(--brown-muted)',
              cursor: hasContent ? 'pointer' : 'default',
              opacity: isTyping ? 0.4 : 1,
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
