'use client';

import { cn } from '@/lib/utils';

function parseContent(text) {
  if (!text || typeof text !== 'string') return [{ type: 'text', value: text || '' }];

  // Check for [OPTIONS]{...}[/OPTIONS] blocks
  var optionsMatch = text.match(/\[OPTIONS\](.*?)\[\/OPTIONS\]/s);
  if (optionsMatch) {
    var before = text.slice(0, text.indexOf('[OPTIONS]')).trim();
    var after = text.slice(text.indexOf('[/OPTIONS]') + 10).trim();
    var items = [];
    try {
      var parsed = JSON.parse(optionsMatch[1]);
      items = parsed.items || [];
    } catch (e) { /* malformed */ }

    var parts = [];
    if (before) parts.push({ type: 'text', value: before });
    if (items.length > 0) parts.push({ type: 'options', items: items });
    if (after) parts.push({ type: 'text', value: after });
    return parts;
  }

  // Clean up any stray markdown formatting
  var clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // remove **bold**
    .replace(/\*(.*?)\*/g, '$1')       // remove *italic*
    .replace(/^#{1,4}\s+/gm, '')       // remove ## headers
    .replace(/^[-*]\s+/gm, '')         // remove - bullet points
    .trim();

  return [{ type: 'text', value: clean }];
}

export default function ChatBubble({ role, content, animate = false, compact = false, onOptionSelect }) {
  var isAI = role === 'ai';
  var parts = isAI ? parseContent(content) : [{ type: 'text', value: content }];

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isAI ? 'self-start' : 'self-end flex-row-reverse',
        animate && 'animate-slide-up'
      )}
      style={{ maxWidth: compact ? '88%' : '76%', minWidth: 0, overflow: 'hidden' }}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {parts.map(function (part, idx) {
          if (part.type === 'options') {
            return (
              <div key={idx} style={{
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {part.items.map(function (item, oidx) {
                  return (
                    <button
                      key={oidx}
                      type="button"
                      onClick={function () { onOptionSelect?.(item); }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border-default)',
                        backgroundColor: '#fff',
                        color: 'var(--brown)',
                        fontFamily: 'var(--font-body)',
                        fontSize: compact ? 12 : 13,
                        lineHeight: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={function (e) {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.backgroundColor = 'rgba(139,105,20,0.03)';
                      }}
                      onMouseLeave={function (e) {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                        e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            );
          }

          // Text block
          return (
            <div
              key={idx}
              className="leading-relaxed rounded-xl"
              style={{
                padding: compact ? '8px 14px' : '12px 16px',
                fontSize: compact ? 12 : 13,
                wordBreak: 'break-word',
                overflow: 'hidden',
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
              {part.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
