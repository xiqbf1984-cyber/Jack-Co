'use client';

export default function ChipSuggestions({ chips = [], onSelect, onHover, compact = false }) {
  if (!chips.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
      {chips.map(function (chip) {
        return (
          <button
            key={chip}
            type="button"
            onClick={function () { onSelect?.(chip); }}
            onMouseEnter={function () { onHover?.(chip); }}
            onMouseLeave={function () { onHover?.(''); }}
            className="shrink-0 border rounded-full hover-border-hover hover-bg-cream transition-all whitespace-nowrap"
            style={{
              padding: compact ? '5px 11px' : '6px 14px',
              fontSize: compact ? 11 : 12,
              borderColor: 'var(--border-default)',
              color: 'var(--brown)',
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
