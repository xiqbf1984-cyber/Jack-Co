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
          className="shrink-0 px-3 py-1 text-body-xs border border-[var(--border-default)] rounded-full text-[var(--brown)] hover:border-[var(--border-hover)] hover:bg-[var(--cream)] transition-all whitespace-nowrap"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
