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
import { FileText, Plus, Briefcase, Users, Sparkles, ArrowRight } from 'lucide-react';

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
  const assessments = useAppStore((s) => s.assessments);
  const draft = useAppStore((s) => s.draft);
  const loadDraft = useAppStore((s) => s.loadDraft);
  const clearDraft = useAppStore((s) => s.clearDraft);
  const openAddCandidateModal = useAppStore((s) => s.openAddCandidateModal);
  const router = useRouter();

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const displayName = company.name && company.name !== 'Your Company' ? company.name : 'there';
  const isZeroData = roles.length === 0 && candidates.length === 0 && assessments.length === 0;

  // ─── Zero-data onboarding state ───
  if (isZeroData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>
            Welcome to NeoHuman
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>
            Let's set up your hiring pipeline. Start by creating a role or explore our sample case.
          </p>
        </div>

        {/* Hero onboarding card */}
        <div style={{
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          background: '#fff',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'fsu .3s ease both',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(139,105,20,0.12), rgba(196,163,50,0.08))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Briefcase size={24} style={{ color: 'var(--gold)' }} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600,
            color: 'var(--brown)', marginBottom: 8,
          }}>
            Create your first role
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
            maxWidth: 360, lineHeight: 1.6, marginBottom: 24,
          }}>
            Describe the position you're hiring for, and our AI will help you generate a professional job description in seconds.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/roles/create" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 24px', fontSize: 13, textDecoration: 'none',
            }}>
              <Plus size={14} /> Create a Role
            </Link>
            <button
              onClick={() => {
                // Load sample mock data for exploration
                const { addRole, addCandidate, addAssessment } = useAppStore.getState();
                addRole({ title: 'AI Research Engineer', dept: 'Research', salary: '$180k-$250k', status: 'active' });
                addRole({ title: 'ML Platform Engineer', dept: 'Infrastructure', salary: '$160k-$220k', status: 'active' });
                addRole({ title: 'AI Product Manager', dept: 'Product', salary: '$150k-$200k', status: 'draft' });
                addCandidate({ name: 'Alex Chen', email: 'alex@gmail.com', status: 'active', tz: 'PST' });
                addCandidate({ name: 'Sarah Kim', email: 'sarah@outlook.com', status: 'completed', tz: 'EST' });
                addCandidate({ name: 'James Liu', email: 'jliu@pm.me', status: 'idle', tz: 'CST' });
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 24px', borderRadius: 8,
                border: '1px solid var(--border-default)', background: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                color: 'var(--brown)', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <Sparkles size={14} style={{ color: 'var(--gold)' }} /> Explore Sample Case
            </button>
          </div>
        </div>

        {/* Company Profile + Getting Started */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          alignItems: 'start',
        }}>
          <CompanyProfileCard />
          <GettingStarted />
        </div>
      </div>
    );
  }

  // ─── Normal dashboard with data ───
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>
          Welcome back, {displayName}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>
          Here's an overview of your hiring pipeline
        </p>
      </div>

      {/* Draft Recovery Banner */}
      {draft && (
        <div style={{
          background: 'rgba(139,105,20,0.08)',
          border: '1px solid rgba(139,105,20,0.22)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          animation: 'fsu .3s ease both',
        }}>
          <FileText size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 600 }}>
              You have an unfinished assessment
              {draft.data?.currentStep != null && ` (Step ${draft.data.currentStep + 1} of 8)`}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 2 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <CompanyProfileCard />
        <GettingStarted />
      </div>

      {/* Hiring Roles + Recent Candidates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Roles panel */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--brown)' }}>
              Hiring Roles
            </h3>
            <Link href="/roles/create" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 7,
              backgroundColor: 'var(--gold)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
              textDecoration: 'none', transition: 'opacity 0.15s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <Plus size={12} /> Add role
            </Link>
          </div>
          <HiringRolesList hideHeader />
        </div>

        {/* Candidates panel */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--brown)' }}>
              Recent Candidates
            </h3>
            <button onClick={openAddCandidateModal} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 7,
              backgroundColor: 'var(--gold)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'opacity 0.15s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <Plus size={12} /> Add candidate
            </button>
          </div>
          <RecentCandidatesList hideHeader />
        </div>
      </div>
    </div>
  );
}
