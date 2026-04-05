'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Briefcase } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

export default function RolesPage() {
  const roles = useAppStore((s) => s.roles);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.dept?.toLowerCase().includes(q)
    );
  }, [roles, search]);

  return (
    <div className="app-page animate-fi">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-display-page">Roles</h1>
        <Link href="/roles/create" className="btn-primary flex items-center gap-1.5">
          <Plus size={15} />
          Add Role
        </Link>
      </div>
      <p className="text-body-lg mb-8">Manage your open positions and hiring pipeline.</p>

      {/* Search */}
      <div className="relative mb-8 max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--brown-soft)' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-body-sm focus:outline-none transition-colors"
          style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--cream-card)', color: 'var(--brown)' }}
        />
      </div>

      {/* Roles list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--cream-sidebar)' }}
          >
            <Briefcase size={28} style={{ color: 'var(--brown-muted)' }} />
          </div>
          <p className="text-body-lg" style={{ color: 'var(--brown-muted)' }}>
            {search ? 'No roles match your search' : 'No roles yet'}
          </p>
          {!search && (
            <Link href="/roles/create" className="btn-primary">
              Create your first role
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((role) => {
            const statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            return (
              <div
                key={role.id}
                className="app-card app-card-interactive flex items-center gap-5 cursor-pointer"
                style={{
                  padding: '22px 28px',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--cream-sidebar)' }}
                >
                  <Briefcase size={20} style={{ color: 'var(--brown-muted)' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="app-card-title truncate">
                    {role.title}
                  </div>
                  <div className="app-card-meta mt-1">
                    {role.dept}
                  </div>
                </div>

                {/* Salary */}
                <div className="text-body-xs hidden sm:block" style={{ color: 'var(--brown-soft)' }}>
                  {role.salary}
                </div>

                {/* Status badge */}
                <span
                  className="text-mono-tag px-3 py-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--${statusInfo.color}) 12%, transparent)`,
                    color: `var(--${statusInfo.color})`,
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
