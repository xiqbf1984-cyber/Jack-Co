'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import StatCards from '@/components/dashboard/stat-cards';
import QuickActions from '@/components/dashboard/quick-actions';
import CompanyProfileCard from '@/components/dashboard/company-profile-card';
import HiringRolesList from '@/components/dashboard/hiring-roles-list';
import RecentCandidatesList from '@/components/dashboard/recent-candidates-list';
import { FileText } from 'lucide-react';

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
  const draft = useAppStore((s) => s.draft);
  const loadDraft = useAppStore((s) => s.loadDraft);
  const clearDraft = useAppStore((s) => s.clearDraft);
  const router = useRouter();

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const displayName = company.name && company.name !== 'Your Company' ? company.name : 'there';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome */}
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
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown)',
              fontWeight: 600,
            }}>
              You have an unfinished assessment
              {draft.data?.currentStep != null && ` (Step ${draft.data.currentStep + 1} of 8)`}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-soft)',
              marginTop: 2,
            }}>
              Last edited {formatTimeAgo(draft.savedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => router.push('/assessment/create')}
              className="btn-primary"
              style={{ padding: '7px 16px', fontSize: 11 }}
            >Continue</button>
            <button
              onClick={clearDraft}
              className="btn-secondary"
              style={{ padding: '7px 16px', fontSize: 11 }}
            >Discard</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <StatCards />

      {/* Quick Actions + Company Profile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        <QuickActions />
        <CompanyProfileCard />
      </div>

      {/* Hiring Roles + Recent Candidates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        <HiringRolesList />
        <RecentCandidatesList />
      </div>
    </div>
  );
}
