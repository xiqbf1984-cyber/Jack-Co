'use client';

import { useAppStore } from '@/stores/app-store';
import { Briefcase, Users, Trophy, FileText, TrendingUp } from 'lucide-react';

const STAT_CONFIG = {
  roles: { icon: Briefcase, color: 'var(--gold)', bg: 'rgba(139,105,20,0.08)' },
  candidates: { icon: Users, color: 'var(--accent-green)', bg: 'rgba(39,130,91,0.08)' },
  assessments: { icon: Trophy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  submissions: { icon: FileText, color: 'var(--brown)', bg: 'rgba(93,84,70,0.08)' },
};

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
      {stats.map((stat, i) => {
        const config = STAT_CONFIG[stat.key];
        const Icon = config.icon;
        return (
          <div
            key={stat.key}
            style={{
              padding: '18px 20px',
              borderRadius: 12,
              border: '1px solid var(--border-default)',
              background: '#fff',
              animation: `fsu .25s ease ${i * 0.06}s both`,
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Watermark icon */}
            <div style={{
              position: 'absolute', right: -4, bottom: -6, opacity: 0.04,
            }}>
              <Icon size={64} strokeWidth={1} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: config.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color: config.color }} />
              </div>
              {stat.value > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--accent-green)',
                }}>
                  <TrendingUp size={10} />
                </div>
              )}
            </div>

            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--brown)',
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown-soft)',
              marginTop: 6,
            }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
