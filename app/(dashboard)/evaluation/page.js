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
  const assessments = useAppStore((s) => s.assessments);
  const candidates = useAppStore((s) => s.candidates);

  const allResults = assessments.flatMap((c) =>
    (c.results || []).map((r) => ({ ...r, assessmentName: c.name, roleTitle: c.roleTitle }))
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
    { label: 'Avg Score', value: avgScore, icon: TrendingUp, color: 'var(--gold)' },
    { label: 'Grade A', value: gradeACount, icon: Award, color: '#27825b' },
    { label: 'Pass Rate', value: `${passRate}%`, icon: BarChart3, color: '#d4880f' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--brown)',
        }}>Evaluation Dashboard</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-soft)',
          marginTop: 4,
        }}>Review candidate scores and assessment results</p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 28,
      }}>
        {evalStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: '18px 20px',
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
                fontFamily: 'var(--font-body)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--brown)',
                marginTop: 6,
              }}>{stat.value}</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                color: 'var(--brown-light)',
                marginTop: 2,
              }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Results grouped by assessment */}
      {assessments.map((assessment) => {
        if (!assessment.results || assessment.results.length === 0) return null;
        return (
          <div key={assessment.id} style={{ marginBottom: 24 }}>
            {/* Group header */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown-soft)',
              fontWeight: 600,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{
                display: 'inline-block',
                width: 20,
                borderTop: '1px solid var(--border-light)',
              }} />
              {assessment.name} — {assessment.roleTitle}
              <span style={{
                flex: 1,
                borderTop: '1px solid var(--border-light)',
              }} />
            </div>

            {/* Score rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {assessment.results.map((result) => {
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
                      padding: '12px 16px',
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
                        fontFamily: 'var(--font-body)',
                        fontSize: 8,
                        fontWeight: 700,
                        color: 'var(--gold)',
                      }}>{initials}</span>
                    </div>

                    {/* Name */}
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--brown)',
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
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--brown)',
                      width: 26,
                      textAlign: 'right',
                    }}>{result.score}</span>

                    {/* Grade letter */}
                    <span style={{
                      fontFamily: 'var(--font-body)',
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          borderRadius: 14,
          border: '1px solid var(--border-default)',
          background: '#fff',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(139,105,20,0.08), rgba(196,163,50,0.12))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <BarChart3 size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--brown)',
            marginBottom: 4,
          }}>No evaluations yet</p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
          }}>Results will appear here as candidates complete their assessments</p>
        </div>
      )}
    </div>
  );
}
