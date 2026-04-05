'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 animate-fi">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
          color: 'var(--btn-text)',
        }}
      >
        AI
      </div>
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-xl"
        style={{
          backgroundColor: 'var(--cream-sidebar)',
          borderTopLeftRadius: '4px',
        }}
      >
        {[0, 0.16, 0.32].map((delay, i) => (
          <span
            key={i}
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: 'var(--brown-muted)',
              animation: `dotBounce 1s ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
