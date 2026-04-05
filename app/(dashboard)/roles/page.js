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
    <div className="flex flex-col h-full px-6 py-6 animate-fi">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display-page">Roles</h1>
        <Link href="/roles/create" className="btn-primary flex items-center gap-1.5">
          <Plus size={15} />
          Add Role
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--brown-soft)' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--cream-card)] text-body-sm text-[var(--brown)] placeholder:text-[var(--brown-soft)] focus:outline-none focus:border-[var(--border-hover)] transition-colors"
        />
      </div>

      {/* Roles list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--cream-sidebar)' }}
          >
            <Briefcase size={24} style={{ color: 'var(--brown-muted)' }} />
          </div>
          <p className="text-body-lg text-[var(--brown-muted)]">
            {search ? 'No roles match your search' : 'No roles yet'}
          </p>
          {!search && (
            <Link href="/roles/create" className="btn-primary">
              Create your first role
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((role) => {
            const statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            return (
              <div
                key={role.id}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[var(--border-default)] bg-[var(--cream-card)] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--cream-sidebar)' }}
                >
                  <Briefcase size={18} style={{ color: 'var(--brown-muted)' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-semibold text-[var(--brown)] truncate">
                    {role.title}
                  </div>
                  <div className="text-body-xs text-[var(--brown-muted)]">
                    {role.dept}
                  </div>
                </div>

                {/* Salary */}
                <div className="text-body-xs text-[var(--brown-soft)] hidden sm:block">
                  {role.salary}
                </div>

                {/* Status badge */}
                <span
                  className="text-mono-tag px-2.5 py-1 rounded-full shrink-0"
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
