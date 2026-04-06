'use client';

import { useAppStore } from '@/stores/app-store';

export default function StatCards() {
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const assessments = useAppStore((s) => s.assessments);
  const totalSubmissions = assessments.reduce((sum, a) => sum + (a.results?.length || 0), 0);

  const stats = [
    { key: 'roles', label: 'Active Roles', value: roles.filter((r) => r.status === 'active').length },
    { key: 'candidates', label: 'Candidates', value: candidates.length },
    { key: 'assessments', label: 'Assessments', value: assessments.length },
    { key: 'submissions', label: 'Submissions', value: totalSubmissions },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
    }}>
      {stats.map((stat, i) => (
        <div
          key={stat.key}
          style={{
            padding: '18px 20px',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            background: '#fff',
            animation: `fsu .25s ease ${i * 0.06}s both`,
          }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--brown)',
          }}>
            {stat.value}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown-soft)',
            marginTop: 4,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
