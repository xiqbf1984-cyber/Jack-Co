'use client';

import { cn } from '@/lib/utils';

export default function ChatBubble({ role, content, animate = false }) {
  const isAI = role === 'ai';

  return (
    <div
      className={cn(
        'flex items-start gap-2.5',
        isAI ? 'self-start' : 'self-end flex-row-reverse',
        animate && 'animate-slide-up'
      )}
      style={{ maxWidth: '85%' }}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
            color: 'var(--btn-text)',
          }}
        >
          AI
        </div>
      )}

      <div
        className="px-4 py-2.5 text-body-sm leading-relaxed rounded-xl"
        style={
          isAI
            ? { backgroundColor: 'var(--cream-sidebar)', color: 'var(--brown)', borderTopLeftRadius: 4 }
            : {
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                color: 'var(--cream)',
                borderTopRightRadius: 4,
              }
        }
      >
        {content}
      </div>
    </div>
  );
}
