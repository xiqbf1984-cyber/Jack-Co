'use client';

import { cn } from '@/lib/utils';
import { GRADE_SCALE } from '@/lib/constants';

function getBarColor(score) {
  if (score >= 93) return 'var(--accent-green)';
  if (score >= 85) return 'var(--blue)';
  if (score >= 75) return 'var(--gold)';
  if (score >= 65) return 'var(--orange)';
  return 'var(--red)';
}

function ScoreBar({ score = 0, grade, className }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const barColor = getBarColor(clampedScore);
  const gradeEntry = grade ? GRADE_SCALE[grade] : null;
  const gradeColor = gradeEntry?.color || barColor;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Bar */}
      <div className="flex-1 h-2 bg-[var(--cream)] border border-[var(--border-default)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedScore}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Score text */}
      <span
        className="text-mono-data min-w-[32px] text-right"
        style={{ color: barColor }}
      >
        {clampedScore}
      </span>

      {/* Grade letter */}
      {grade && (
        <span
          className="text-mono-data w-6 text-center font-bold"
          style={{ color: gradeColor }}
        >
          {grade}
        </span>
      )}
    </div>
  );
}

export { ScoreBar };
