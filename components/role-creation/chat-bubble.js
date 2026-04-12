'use client';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\[UI\][\s\S]*?\[\/UI\]/g, '')
    .replace(/\[UI\][\s\S]*$/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .trim();
}

export default function ChatBubble({ role, content, animate = false, compact = false }) {
  var isAI = role === 'ai';
  var displayText = cleanText(content);

  if (!displayText) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      animation: animate ? 'fsu 0.2s ease both' : 'none',
    }}>
      <div style={{
        padding: compact ? '8px 14px' : '10px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: compact ? 12 : 13,
        lineHeight: 1.6,
        wordBreak: 'break-word',
        maxWidth: isAI ? '94%' : '80%',
        borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        ...(isAI
          ? { backgroundColor: 'var(--cream-sidebar)', color: 'var(--brown)' }
          : { background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))', color: 'var(--cream)' }),
      }}>
        {displayText}
      </div>
    </div>
  );
}

// Export parser for use by ChatPanel
export function parseUIBlock(content) {
  if (!content || typeof content !== 'string') return null;
  var match = content.match(/\[UI\]([\s\S]*?)\[\/UI\]/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch (e) { return null; }
}
