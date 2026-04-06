'use client';

export default function ChipSuggestions({ chips = [], onSelect, onHover, compact = false }) {
  if (!chips.length) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: compact ? 6 : 8,
      animation: 'fsu 0.2s ease both',
    }}>
      {chips.map(function (chip) {
        return (
          <button
            key={chip}
            type="button"
            onClick={function () { onSelect?.(chip); }}
            onMouseEnter={function () { onHover?.(chip); }}
            onMouseLeave={function () { onHover?.(''); }}
            style={{
              padding: compact ? '6px 14px' : '8px 16px',
              fontSize: compact ? 11 : 12,
              fontFamily: 'var(--font-body)',
              borderRadius: 20,
              border: '1px solid var(--border-default)',
              backgroundColor: '#fff',
              color: 'var(--brown)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.backgroundColor = 'var(--cream)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
