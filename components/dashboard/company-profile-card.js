'use client';

import Link from 'next/link';
import { MapPin, Globe, Building2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function CompanyProfileCard() {
  const company = useAppStore((s) => s.company);

  return (
    <div className="h-full">
      <h3 className="text-display-section mb-3">Company Profile</h3>
      <div
        className="rounded-xl border h-full flex flex-col"
        style={{
          padding: '20px',
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-mono font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
              color: 'var(--brown)',
            }}
          >
            {company.logo}
          </div>
          <div>
            <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
              {company.name}
            </div>
            <div className="text-body-xs">{company.industry}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center gap-2 text-body-xs">
            <MapPin size={12} style={{ color: 'var(--brown-soft)' }} />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs">
            <Building2 size={12} style={{ color: 'var(--brown-soft)' }} />
            <span>{company.size} employees</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs">
            <Globe size={12} style={{ color: 'var(--brown-soft)' }} />
            <span>{company.website}</span>
          </div>
        </div>

        <Link
          href="/settings/company"
          className="btn-secondary w-full text-center no-underline block mt-auto"
          style={{ fontSize: '12px' }}
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
