'use client';

import { useAppStore } from '@/stores/app-store';

export default function CompanySettingsPage() {
  const company = useAppStore((s) => s.company);
  const setCompany = useAppStore((s) => s.setCompany);

  const fields = [
    { key: 'name', label: 'Company Name', placeholder: 'Anthropic' },
    { key: 'industry', label: 'Industry', placeholder: 'AI Safety & Research' },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
    { key: 'size', label: 'Company Size', placeholder: '500-1000' },
    { key: 'website', label: 'Website', placeholder: 'anthropic.com' },
  ];

  return (
    <div className="p-8 animate-fade-scale" style={{ maxWidth: 720 }}>
      <h1 className="text-display-page mb-1">Company Profile</h1>
      <p className="text-body-lg mb-6">Update your company information.</p>

      <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6">
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          {fields.map((field) => (
            <div key={field.key} className={field.key === 'name' ? 'col-span-2' : ''}>
              <label className="text-mono-label block mb-1.5">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={company[field.key]}
                onChange={(e) => setCompany({ [field.key]: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus:border-[var(--border-hover)]"
                style={{
                  backgroundColor: 'var(--cream)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--brown)',
                }}
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="text-mono-label block mb-1.5">Description</label>
          <textarea
            rows={3}
            placeholder="Brief description of your company..."
            value={company.description}
            onChange={(e) => setCompany({ description: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body resize-none focus:border-[var(--border-hover)]"
            style={{
              backgroundColor: 'var(--cream)',
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
