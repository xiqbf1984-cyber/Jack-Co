'use client';

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'fi 0.2s ease both' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '10px 16px',
          borderRadius: '4px 14px 14px 14px',
          backgroundColor: 'var(--cream-sidebar)',
        }}
      >
        {[0, 0.16, 0.32].map(function (delay, i) {
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 5, height: 5, borderRadius: '50%',
                backgroundColor: 'var(--brown-muted)',
                animation: 'dotBounce 1s ' + delay + 's infinite',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
