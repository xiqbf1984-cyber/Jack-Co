'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { Search, Plus, Trophy } from 'lucide-react';

const statusColors = {
  published: '#27825b',
  submitted: '#0077B5',
  pending: '#d4880f',
  draft: '#c4b896',
};

export default function ChallengesPage() {
  const challenges = useAppStore((s) => s.challenges);
  const [search, setSearch] = useState('');

  const filtered = challenges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.roleTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-display-page">Assessment</h1>
        <Link href="/assessment/create" className="btn-primary no-underline">
          <Plus size={14} /> New Assessment
        </Link>
      </div>
      <p className="text-body-lg mb-6">Create and manage AI-powered assessments for your roles.</p>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--brown-soft)' }} />
        <input
          type="text"
          placeholder="Search assessments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
          style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
        />
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((challenge, i) => (
            <Link
              key={challenge.id}
              href={`/assessment/${challenge.id}`}
              className="block rounded-xl border transition-all duration-200 no-underline hover-shadow-card"
              style={{
                padding: '20px 24px',
                backgroundColor: 'var(--cream-card)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card)',
                animation: `fsu 0.2s ease-out ${i * 0.05}s both`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-body-sm font-semibold mb-1.5" style={{ color: 'var(--brown)' }}>
                    {challenge.name}
                  </div>
                  <div className="text-body-xs">
                    {challenge.roleTitle} &middot; {challenge.skill}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-mono-tag" style={{ color: 'var(--brown-soft)' }}>
                    {challenge.candIds?.length || 0} candidates
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: (statusColors[challenge.status] || '#c4b896') + '14' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[challenge.status] }} />
                    <span className="text-mono-tag" style={{ color: statusColors[challenge.status] }}>{challenge.status}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Trophy size={40} className="mx-auto mb-4" style={{ color: 'var(--brown-light)' }} />
          <p className="text-body-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>No assessments yet</p>
          <p className="text-body-xs">Create your first assessment.</p>
        </div>
      )}
    </div>
  );
}
