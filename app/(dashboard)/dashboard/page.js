'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import StatCards from '@/components/dashboard/stat-cards';
import CompanyProfileCard from '@/components/dashboard/company-profile-card';
import GettingStarted from '@/components/dashboard/getting-started';
import HiringRolesList from '@/components/dashboard/hiring-roles-list';
import RecentCandidatesList from '@/components/dashboard/recent-candidates-list';
import { FileText, Plus, Briefcase, Trophy } from 'lucide-react';

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function DashboardPage() {
  const company = useAppStore((s) => s.company);
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const draft = useAppStore((s) => s.draft);
  const loadDraft = useAppStore((s) => s.loadDraft);
  const clearDraft = useAppStore((s) => s.clearDraft);
  const router = useRouter();

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const displayName = company.name && company.name !== 'Your Company' ? company.name : 'there';
  const hasRoles = roles.length > 0;
  const hasCandidates = candidates.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome + Quick Create */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--brown)',
          }}>
            Welcome back, {displayName}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            marginTop: 4,
          }}>Here's an overview of your hiring pipeline</p>
        </div>
        {/* Compact quick create buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/roles/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
            textDecoration: 'none', transition: 'all 0.15s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Briefcase size={13} style={{ color: 'var(--gold)' }} /> New Role
          </Link>
          <Link href="/assessment/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
            textDecoration: 'none', transition: 'all 0.15s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Trophy size={13} style={{ color: 'var(--accent-green)' }} /> New Assessment
          </Link>
        </div>
      </div>

      {/* Draft Recovery Banner */}
      {draft && (
        <div style={{
          background: 'rgba(139,105,20,0.08)',
          border: '1px solid rgba(139,105,20,0.22)',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          animation: 'fsu .3s ease both',
        }}>
          <FileText size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 12,
              color: 'var(--brown)', fontWeight: 600,
            }}>
              You have an unfinished assessment
              {draft.data?.currentStep != null && ` (Step ${draft.data.currentStep + 1} of 8)`}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 10,
              color: 'var(--brown-soft)', marginTop: 2,
            }}>
              Last edited {formatTimeAgo(draft.savedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/assessment/create')}
              className="btn-primary" style={{ padding: '7px 16px', fontSize: 11 }}>Continue</button>
            <button onClick={clearDraft}
              className="btn-secondary" style={{ padding: '7px 16px', fontSize: 11 }}>Discard</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <StatCards />

      {/* Company Profile (left) + Getting Started (right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'start',
      }}>
        <CompanyProfileCard />
        <GettingStarted />
      </div>

      {/* Hiring Roles + Recent Candidates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        {hasRoles ? (
          <HiringRolesList />
        ) : (
          <EmptySection
            title="Hiring Roles"
            message="Create your first role to start building your hiring pipeline."
            actionLabel="Create Role"
            actionHref="/roles/create"
            icon={Briefcase}
          />
        )}
        {hasCandidates ? (
          <RecentCandidatesList />
        ) : (
          <EmptySection
            title="Recent Candidates"
            message="Add candidates to track their progress through your hiring process."
            actionLabel="Add Candidate"
            onClick={() => useAppStore.getState().openAddCandidateModal()}
            icon={null}
          />
        )}
      </div>
    </div>
  );
}

function EmptySection({ title, message, actionLabel, actionHref, onClick, icon }) {
  const Icon = icon;
  const content = (
    <div style={{
      padding: '32px 20px',
      borderRadius: 12,
      border: '1px dashed var(--border-default)',
      background: 'rgba(255,255,255,0.5)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        backgroundColor: 'rgba(139,105,20,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
      }}>
        {Icon ? <Icon size={18} style={{ color: 'var(--brown-light)' }} /> : (
          <Plus size={18} style={{ color: 'var(--brown-light)' }} />
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
        maxWidth: 220, lineHeight: 1.5,
      }}>
        {message}
      </div>
      {actionHref ? (
        <Link href={actionHref} className="btn-primary" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 16px', fontSize: 11, textDecoration: 'none', marginTop: 4,
        }}>
          <Plus size={11} /> {actionLabel}
        </Link>
      ) : onClick ? (
        <button onClick={onClick} className="btn-primary" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 16px', fontSize: 11, marginTop: 4,
        }}>
          <Plus size={11} /> {actionLabel}
        </button>
      ) : null}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--brown)',
        }}>{title}</h3>
      </div>
      {content}
    </div>
  );
}
