'use client';

import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { CheckCircle, Circle, Building2, Briefcase, Users, Trophy, ArrowRight } from 'lucide-react';

export default function GettingStarted() {
  const company = useAppStore((s) => s.company);
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const assessments = useAppStore((s) => s.assessments);

  const steps = [
    {
      id: 'profile',
      label: 'Set up company profile',
      desc: 'Add your company details',
      done: company.description && company.description.length > 0,
      href: '/settings',
      icon: Building2,
    },
    {
      id: 'role',
      label: 'Create your first role',
      desc: 'Define a job description',
      done: roles.length > 0,
      href: '/roles/create',
      icon: Briefcase,
    },
    {
      id: 'candidate',
      label: 'Add candidates',
      desc: 'Build your talent pool',
      done: candidates.length > 0,
      href: '/candidates',
      icon: Users,
    },
    {
      id: 'assessment',
      label: 'Design an assessment',
      desc: 'Create a work-sample test',
      done: assessments.length > 0,
      href: '/assessment/create',
      icon: Trophy,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const progress = (completedCount / steps.length) * 100;

  if (allDone) return null;

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid var(--border-default)',
      background: '#fff',
      padding: '16px 18px',
      animation: 'fsu .3s ease both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--brown)',
        }}>Getting Started</h3>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--brown-soft)',
        }}>
          {completedCount}/{steps.length} completed
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3, borderRadius: 2, backgroundColor: 'var(--cream)',
        marginBottom: 14, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          backgroundColor: 'var(--accent-green)',
          width: progress + '%',
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.id}
              href={step.done ? '#' : step.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 8px', borderRadius: 8, textDecoration: 'none',
                transition: 'background-color 0.1s ease',
                opacity: step.done ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!step.done) e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {step.done ? (
                <CheckCircle size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
              ) : (
                <Circle size={16} style={{ color: 'var(--border-hover)', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                  color: step.done ? 'var(--brown-soft)' : 'var(--brown)',
                  textDecoration: step.done ? 'line-through' : 'none',
                }}>
                  {step.label}
                </div>
                {!step.done && (
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 10,
                    color: 'var(--brown-soft)', marginTop: 1,
                  }}>
                    {step.desc}
                  </div>
                )}
              </div>
              {!step.done && (
                <ArrowRight size={12} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
