'use client';

import { useAppStore } from '@/stores/app-store';
import { GRADE_SCALE } from '@/lib/constants';
import { BarChart3, FileCheck, TrendingUp, Award } from 'lucide-react';

function getGrade(score) {
  for (const [letter, range] of Object.entries(GRADE_SCALE)) {
    if (score >= range.min && score <= range.max) return { letter, color: range.color };
  }
  return { letter: 'F', color: '#c0392b' };
}

export default function EvaluationPage() {
  const challenges = useAppStore((s) => s.challenges);
  const candidates = useAppStore((s) => s.candidates);

  const allResults = challenges.flatMap((c) =>
    (c.results || []).map((r) => ({ ...r, challengeName: c.name, roleTitle: c.roleTitle }))
  );

  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
    : 0;
  const gradeACount = allResults.filter((r) => r.score >= 93).length;
  const passRate = allResults.length > 0
    ? Math.round((allResults.filter((r) => r.score >= 75).length / allResults.length) * 100)
    : 0;

  const stats = [
    { label: 'Submissions', value: allResults.length, icon: FileCheck, color: '#0077B5' },
    { label: 'Avg Score', value: avgScore, icon: TrendingUp, color: '#8b6914' },
    { label: 'Grade A', value: gradeACount, icon: Award, color: '#27825b' },
    { label: 'Pass Rate', value: `${passRate}%`, icon: BarChart3, color: '#d4880f' },
  ];

  // Group by role
  const byRole = {};
  challenges.forEach((c) => {
    if (!byRole[c.roleTitle]) byRole[c.roleTitle] = [];
    byRole[c.roleTitle].push(c);
  });

  return (
    <div className="p-8 animate-fade-scale" style={{ maxWidth: 1000 }}>
      <h1 className="text-display-page mb-6">Evaluation</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--cream-card)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card)',
                animation: `fsu 0.25s ease-out ${i * 0.06}s both`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-mono-label">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-mono-display" style={{ color: 'var(--brown)' }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Results by role */}
      {Object.entries(byRole).map(([roleTitle, roleChallenges]) => (
        <div key={roleTitle} className="mb-8">
          <h3 className="text-display-section mb-3">{roleTitle}</h3>
          <div className="space-y-3">
            {roleChallenges.slice(0, 2).map((challenge) => (
              <div
                key={challenge.id}
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: 'var(--cream-card)',
                  borderColor: 'var(--border-default)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                    {challenge.name}
                  </span>
                  <span className="text-mono-tag" style={{ color: 'var(--brown-soft)' }}>
                    {challenge.skill}
                  </span>
                </div>
                <div className="space-y-2">
                  {(challenge.results || []).map((result) => {
                    const cand = candidates.find((c) => c.id === result.candId);
                    const grade = getGrade(result.score);
                    return (
                      <div key={result.candId} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-mono font-bold shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
                            color: 'var(--brown)',
                          }}
                        >
                          {cand?.avatar || '??'}
                        </div>
                        <span className="text-body-xs w-24 shrink-0" style={{ color: 'var(--brown)' }}>
                          {cand?.name || 'Unknown'}
                        </span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--cream-row-even)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${result.score}%`,
                              backgroundColor: grade.color,
                            }}
                          />
                        </div>
                        <span className="text-mono-data w-8 text-right" style={{ color: 'var(--brown)' }}>
                          {result.score}
                        </span>
                        <span
                          className="text-mono-data w-6 text-center font-bold"
                          style={{ color: grade.color }}
                        >
                          {grade.letter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {roleChallenges.length > 2 && (
              <button
                className="text-body-xs font-semibold hover:underline"
                style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View all {roleChallenges.length} challenges →
              </button>
            )}
          </div>
        </div>
      ))}

      {allResults.length === 0 && (
        <div className="text-center py-16">
          <BarChart3 size={40} className="mx-auto mb-3" style={{ color: 'var(--brown-light)' }} />
          <p className="text-body-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>No evaluations yet</p>
          <p className="text-body-xs">Results will appear as candidates complete challenges.</p>
        </div>
      )}
    </div>
  );
}
