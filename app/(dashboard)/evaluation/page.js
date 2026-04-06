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
    ? Math.round((allResults.filter((r) => r.score >= 65).length / allResults.length) * 100)
    : 0;

  const evalStats = [
    { label: 'Submissions', value: allResults.length, icon: FileCheck, color: '#0077B5' },
    { label: 'Avg Score', value: avgScore, icon: TrendingUp, color: '#8b6914' },
    { label: 'Grade A', value: gradeACount, icon: Award, color: '#27825b' },
    { label: 'Pass Rate', value: `${passRate}%`, icon: BarChart3, color: '#d4880f' },
  ];

  return (
    <div>
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 20,
        fontWeight: 700,
        color: '#1a1612',
        marginBottom: 20,
      }}>Evaluation Dashboard</h1>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {evalStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: 16,
                borderRadius: 14,
                border: '1px solid var(--border-default)',
                background: '#fff',
                textAlign: 'center',
                animation: `fsu .25s ease ${i * 0.06}s both`,
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: stat.color + '1a',
              }}>
                <Icon size={15} style={{ color: stat.color }} />
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: '#1a1612',
                marginTop: 6,
              }}>{stat.value}</div>
              <div style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: 10,
                color: '#c4b896',
                marginTop: 2,
              }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Results grouped by challenge */}
      {challenges.map((challenge) => {
        if (!challenge.results || challenge.results.length === 0) return null;
        return (
          <div key={challenge.id} style={{ marginBottom: 20 }}>
            {/* Group header */}
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 12,
              color: '#9a9184',
              fontWeight: 600,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{
                display: 'inline-block',
                width: 20,
                borderTop: '1px solid var(--border-light)',
              }} />
              {challenge.name} — {challenge.roleTitle}
              <span style={{
                flex: 1,
                borderTop: '1px solid var(--border-light)',
              }} />
            </div>

            {/* Score rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {challenge.results.map((result) => {
                const cand = candidates.find((c) => c.id === result.candId);
                const grade = getGrade(result.score);
                const initials = cand?.avatar || '??';

                return (
                  <div
                    key={result.candId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border-default)',
                      background: '#fff',
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, rgba(139,105,20,0.13), rgba(196,163,50,0.13))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8,
                        fontWeight: 700,
                        color: '#8b6914',
                      }}>{initials}</span>
                    </div>

                    {/* Name */}
                    <span style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: 12,
                      color: '#1a1612',
                      flex: 1,
                    }}>{cand?.name || 'Unknown'}</span>

                    {/* Progress bar */}
                    <div style={{
                      width: 80,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: 'var(--border-default)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${result.score}%`,
                        height: '100%',
                        borderRadius: 3,
                        backgroundColor: grade.color,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>

                    {/* Score */}
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1a1612',
                      width: 26,
                      textAlign: 'right',
                    }}>{result.score}</span>

                    {/* Grade letter */}
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: grade.color,
                      width: 16,
                      textAlign: 'center',
                    }}>{grade.letter}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {allResults.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <BarChart3 size={32} style={{ color: '#c4b896', marginBottom: 12 }} />
          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: '#9a9184' }}>
            No evaluations yet. Results will appear as candidates complete assessments.
          </p>
        </div>
      )}
    </div>
  );
}
