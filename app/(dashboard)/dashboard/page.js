'use client';

import { useEffect, useState } from 'react';
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
    <div>
      {/* Welcome */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 26,
        fontWeight: 700,
        color: '#1a1612',
        marginBottom: draft ? 16 : 24,
      }}>
        Welcome back, {displayName}
      </h1>

      {/* Draft Recovery Banner */}
      {draft && (
        <div style={{
          background: 'rgba(139,105,20,0.08)',
          border: '1px solid rgba(139,105,20,0.22)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          animation: 'fsu .3s ease both',
        }}>
          <FileText size={18} style={{ color: '#8b6914', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 12,
              color: '#1a1612',
              fontWeight: 600,
            }}>
              You have an unfinished assessment
              {draft.data?.currentStep != null && ` (Step ${draft.data.currentStep + 1} of 8)`}
            </div>
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 10,
              color: '#9a9184',
              marginTop: 2,
            }}>
              Last edited {formatTimeAgo(draft.savedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => router.push('/assessment/create')}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                color: 'var(--btn-text)',
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >Continue</button>
            <button
              onClick={clearDraft}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: '#fff',
                color: '#9a9184',
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
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
        marginBottom: 24,
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
