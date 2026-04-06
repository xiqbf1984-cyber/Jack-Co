'use client';

export default function ChipSuggestions({ chips = [], onSelect, onHover, compact = false }) {
  if (!chips.length) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
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
              padding: compact ? '5px 12px' : '6px 14px',
              fontSize: compact ? 11 : 12,
              fontFamily: 'var(--font-body)',
              borderRadius: 20,
              border: '1px solid var(--border-default)',
              backgroundColor: '#fff',
              color: 'var(--brown)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.backgroundColor = 'var(--cream)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
