'use client';

import { useAppStore } from '@/stores/app-store';
import StatCards from '@/components/dashboard/stat-cards';
import QuickActions from '@/components/dashboard/quick-actions';
import CompanyProfileCard from '@/components/dashboard/company-profile-card';
import HiringRolesList from '@/components/dashboard/hiring-roles-list';
import RecentAssessmentsList from '@/components/dashboard/recent-assessments-list';

export default function DashboardPage() {
  const company = useAppStore((s) => s.company);

  return (
    <div className="page-shell">
      {/* Welcome */}
      <div className="mb-8 animate-fade-scale">
        <h1 className="text-display-page mb-1">
          Welcome back, {company.name}
        </h1>
        <p className="text-body-lg">
          Overview of your hiring pipeline.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8">
        <StatCards />
      </div>

      {/* Quick Actions + Company Profile */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 280px', alignItems: 'stretch' }}>
        <QuickActions />
        <CompanyProfileCard />
      </div>

      {/* Hiring Roles + Recent Assessments */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)', alignItems: 'stretch' }}>
        <HiringRolesList />
        <RecentAssessmentsList />
      </div>
    </div>
  );
}
