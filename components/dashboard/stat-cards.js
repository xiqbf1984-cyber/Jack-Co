'use client';

import { Briefcase, Users, Trophy, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const iconMap = { roles: Briefcase, candidates: Users, assessments: Trophy, eval: BarChart3 };

export default function StatCards() {
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const assessments = useAppStore((s) => s.assessments);
  const totalSubmissions = assessments.reduce((sum, a) => sum + (a.results?.length || 0), 0);

  const stats = [
    { key: 'roles', label: 'Active Roles', value: roles.filter((r) => r.status === 'active').length, icon: 'roles', color: '#27825b' },
    { key: 'candidates', label: 'Candidates', value: candidates.length, icon: 'candidates', color: '#0077B5' },
    { key: 'assessments', label: 'Assessments', value: assessments.length, icon: 'assessments', color: '#8b6914' },
    { key: 'submissions', label: 'Submissions', value: totalSubmissions, icon: 'eval', color: '#d4880f' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
    }}>
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
          <div
            key={stat.key}
            style={{
              padding: '16px 18px',
              borderRadius: 12,
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
              marginTop: 8,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-light)',
              marginTop: 4,
            }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
