'use client';

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
    if (before) parts.push({ type: 'text', value: cleanMarkdown(before) });
    if (items.length > 0) parts.push({ type: 'options', items: items.map(cleanMarkdown) });
    if (after) parts.push({ type: 'text', value: cleanMarkdown(after) });
    return parts;
  }

  return [{ type: 'text', value: cleanMarkdown(text) }];
}

function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .trim();
}

export default function ChatBubble({ role, content, animate = false, compact = false, onOptionSelect }) {
  var isAI = role === 'ai';
  var parts = isAI ? parseContent(content) : [{ type: 'text', value: content }];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAI ? 'flex-start' : 'flex-end',
        animation: animate ? 'fsu 0.2s ease both' : 'none',
      }}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        maxWidth: '92%', minWidth: 0,
      }}>
        {parts.map(function (part, idx) {
          if (part.type === 'options') {
            return (
              <div key={idx} style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                paddingLeft: 2,
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
              style={{
                padding: compact ? '8px 14px' : '10px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: compact ? 12 : 13,
                lineHeight: 1.6,
                wordBreak: 'break-word',
                borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                ...(isAI
                  ? {
                      backgroundColor: 'var(--cream-sidebar)',
                      color: 'var(--brown)',
                    }
                  : {
                      background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                      color: 'var(--cream)',
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
