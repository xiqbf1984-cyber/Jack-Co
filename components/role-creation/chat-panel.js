'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatBubble from './chat-bubble';
import TypingIndicator from './typing-indicator';
import ChipSuggestions from './chip-suggestions';

export default function ChatPanel({ messages = [], onSend, currentQuestion, isTyping }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSubmit(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput('');
  }

  function handleChip(chip) {
    onSend?.(chip);
    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            animate={i === messages.length - 1}
          />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Chip suggestions after the last AI message */}
        {!isTyping && currentQuestion?.chips && messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && (
          <div className="ml-9 mt-1">
            <ChipSuggestions chips={currentQuestion.chips} onSelect={handleChip} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-5 pb-4 pt-2 border-t border-[var(--border-light)]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--cream-card)] text-body-sm text-[var(--brown)] placeholder:text-[var(--brown-soft)] focus:outline-none focus:border-[var(--border-hover)] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary p-2.5 rounded-lg disabled:opacity-30"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
