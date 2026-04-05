'use client';

import { cn } from '@/lib/utils';
import { Briefcase, Users, Trophy, FileCheck } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const stats = [
  { key: 'roles', label: 'Active Roles', icon: Briefcase, color: '#27825b' },
  { key: 'candidates', label: 'Candidates', icon: Users, color: '#0077B5' },
  { key: 'challenges', label: 'Assessments', icon: Trophy, color: '#8b6914' },
  { key: 'submissions', label: 'Submissions', icon: FileCheck, color: '#d4880f' },
];

export default function StatCards() {
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const challenges = useAppStore((s) => s.challenges);

  const counts = {
    roles: roles.filter((r) => r.status === 'active').length,
    candidates: candidates.length,
    challenges: challenges.length,
    submissions: challenges.reduce((sum, c) => sum + (c.results?.length || 0), 0),
  };

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="rounded-xl p-6 border transition-all duration-200 hover-shadow-card"
            style={{
              backgroundColor: 'var(--cream-card)',
              borderColor: 'var(--border-default)',
              boxShadow: 'var(--shadow-card)',
              animation: `fsu 0.25s ease-out ${i * 0.06}s both`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-mono-label">{stat.label}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '18' }}
              >
                <Icon size={17} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-mono-display" style={{ color: 'var(--brown)' }}>
              {counts[stat.key]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
