'use client';

export default function ChipSuggestions({ chips = [], onSelect }) {
  if (!chips.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect?.(chip)}
          className="shrink-0 px-3 py-1 text-body-xs border rounded-full hover-border-hover hover-bg-cream transition-all whitespace-nowrap"
          style={{ borderColor: 'var(--border-default)', color: 'var(--brown)' }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
