'use client';

import { useAppStore } from '@/stores/app-store';
import StatCards from '@/components/dashboard/stat-cards';
import QuickActions from '@/components/dashboard/quick-actions';
import CompanyProfileCard from '@/components/dashboard/company-profile-card';
import HiringRolesList from '@/components/dashboard/hiring-roles-list';
import RecentCandidatesList from '@/components/dashboard/recent-candidates-list';

export default function DashboardPage() {
  const company = useAppStore((s) => s.company);

  return (
    <div style={{ padding: 'var(--page-padding-y) var(--page-padding-x)', maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>
      {/* Welcome */}
      <div className="mb-10 animate-fade-scale">
        <h1 className="text-display-page mb-1">
          Welcome back, {company.name}
        </h1>
        <p className="text-body-lg">
          Overview of your hiring pipeline.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-10">
        <StatCards />
      </div>

      {/* Quick Actions + Company Profile */}
      <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: '1fr 360px' }}>
        <QuickActions />
        <CompanyProfileCard />
      </div>

      {/* Hiring Roles + Recent Candidates */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <HiringRolesList />
        <RecentCandidatesList />
      </div>
    </div>
  );
}
