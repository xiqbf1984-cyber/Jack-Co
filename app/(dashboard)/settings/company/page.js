'use client';

import { useAppStore } from '@/stores/app-store';

export default function CompanySettingsPage() {
  const company = useAppStore((s) => s.company);
  const setCompany = useAppStore((s) => s.setCompany);

  const fields = [
    { key: 'name', label: 'Company Name', placeholder: 'Acme Corp' },
    { key: 'industry', label: 'Industry', placeholder: 'Technology' },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
    { key: 'size', label: 'Company Size', placeholder: '50-200' },
    { key: 'website', label: 'Website', placeholder: 'acme.com' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <h1 className="text-display-page mb-2">Company Profile</h1>
      <p className="text-body-lg mb-8">Update your company information.</p>

      <div className="rounded-xl border" style={{ padding: '28px', backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card)' }}>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-[20px] font-mono font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
              color: 'var(--brown)',
            }}
          >
            {company.logo}
          </div>
          <div>
            <p className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>Company Logo</p>
            <p className="text-body-xs">Upload a logo or we'll use your initials.</p>
          </div>
        </div>

        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {fields.map((field) => (
            <div key={field.key} style={field.key === 'name' ? { gridColumn: 'span 2' } : undefined}>
              <label className="text-mono-label block mb-2">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={company[field.key]}
                onChange={(e) => setCompany({ [field.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
                style={{
                  backgroundColor: 'var(--cream-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--brown)',
                }}
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label className="text-mono-label block mb-2">Description</label>
          <textarea
            rows={3}
            placeholder="Brief description of your company..."
            value={company.description}
            onChange={(e) => setCompany({ description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body resize-none focus-border-hover"
            style={{
              backgroundColor: 'var(--cream-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--brown)',
            }}
          />
        </div>

        <button className="btn-primary">Save Company Profile</button>
      </div>
    </div>
  );
}
