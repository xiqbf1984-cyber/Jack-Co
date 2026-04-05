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
    <div className="p-8" style={{ maxWidth: 1200 }}>
      {/* Welcome */}
      <div className="mb-6 animate-fade-scale">
        <h1 className="text-display-page mb-1">
          Welcome back, {company.name}
        </h1>
        <p className="text-body-lg">
          Manage your roles, challenges, and candidates.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8">
        <StatCards />
      </div>

      {/* Quick Actions + Company Profile */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 320px' }}>
        <QuickActions />
        <CompanyProfileCard />
      </div>

      {/* Hiring Roles + Recent Candidates */}
      <div className="grid grid-cols-2 gap-6">
        <HiringRolesList />
        <RecentCandidatesList />
      </div>
    </div>
  );
}
