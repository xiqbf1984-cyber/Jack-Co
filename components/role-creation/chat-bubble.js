'use client';

import { cn } from '@/lib/utils';

export default function ChatBubble({ role, content, animate = false, compact = false }) {
  var isAI = role === 'ai';

  return (
    <div
      className={cn(
        'flex items-start gap-2.5',
        isAI ? 'self-start' : 'self-end flex-row-reverse',
        animate && 'animate-slide-up'
      )}
      style={{ maxWidth: compact ? '85%' : '72%' }}
    >
      {isAI && (
        <div
          className="rounded-full flex items-center justify-center font-bold shrink-0"
          style={{
            width: compact ? 24 : 28,
            height: compact ? 24 : 28,
            fontSize: compact ? 9 : 11,
            background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
            color: 'var(--btn-text)',
          }}
        >
          AI
        </div>
      )}

      <div
        className="leading-relaxed rounded-xl"
        style={{
          padding: compact ? '6px 12px' : '10px 16px',
          fontSize: compact ? 12 : 13,
          ...(isAI
            ? {
                backgroundColor: 'var(--cream-sidebar)',
                color: 'var(--brown)',
                borderTopLeftRadius: 4,
              }
            : {
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                color: 'var(--cream)',
                borderTopRightRadius: 4,
              }),
        }}
      >
        {content}
      </div>
    </div>
  );
}
