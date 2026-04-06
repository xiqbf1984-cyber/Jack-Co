'use client';

import { Briefcase, Users, Trophy, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const iconMap = { roles: Briefcase, candidates: Users, challenge: Trophy, eval: BarChart3 };

export default function StatCards() {
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const challenges = useAppStore((s) => s.challenges);
  const totalSubmissions = challenges.reduce((sum, c) => sum + (c.results?.length || 0), 0);

  const stats = [
    { key: 'roles', label: 'Active Roles', value: roles.filter((r) => r.status === 'active').length, icon: 'roles', color: '#27825b' },
    { key: 'candidates', label: 'Candidates', value: candidates.length, icon: 'candidates', color: '#0077B5' },
    { key: 'challenges', label: 'Challenges', value: challenges.length, icon: 'challenge', color: '#8b6914' },
    { key: 'submissions', label: 'Submissions', value: totalSubmissions, icon: 'eval', color: '#d4880f' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginBottom: 24,
    }}>
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
          <div
            key={stat.key}
            style={{
              padding: '18px 20px',
              borderRadius: 14,
              border: '1px solid var(--border-default)',
              background: '#fff',
              textAlign: 'center',
              animation: `fsu .25s ease ${i * 0.06}s both`,
            }}
          >
            {/* Icon container */}
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
            {/* Number */}
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: '#1a1612',
              marginTop: 8,
            }}>
              {stat.value}
            </div>
            {/* Label */}
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 10,
              color: '#c4b896',
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
