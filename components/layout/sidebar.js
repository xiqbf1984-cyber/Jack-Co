'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Bell, Sun, Moon, ChevronRight
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col border-r transition-all duration-300 ease-in-out',
        expanded ? 'w-[200px]' : 'w-[60px]'
      )}
      style={{
        backgroundColor: 'var(--cream-sidebar)',
        borderColor: 'var(--border-light)',
      }}
    >
      {/* Logo */}
      <div className="h-[56px] flex items-center px-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              color: 'var(--btn-text)',
            }}
          >
            W
          </div>
          {expanded && (
            <span
              className="font-display text-[14px] font-semibold whitespace-nowrap animate-fi"
              style={{ color: 'var(--brown)' }}
            >
              WorkTrial
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
        <span
          className={cn(
            'text-mono-label px-2 mb-1',
            !expanded && 'sr-only'
          )}
        >
          Navigation
        </span>
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 no-underline text-[12px] font-body',
                isActive
                  ? 'font-semibold'
                  : 'hover:bg-[rgba(0,0,0,0.04)]'
              )}
              style={{
                color: isActive ? 'var(--gold)' : 'var(--brown)',
                backgroundColor: isActive ? 'rgba(139,105,20,0.06)' : undefined,
              }}
              title={!expanded ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {expanded && (
                <span className="whitespace-nowrap animate-fi">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-3 flex flex-col gap-1 border-t pt-3" style={{ borderColor: 'var(--border-light)' }}>
        {/* Plan */}
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-1.5 rounded-lg text-[11px]',
            !expanded && 'justify-center'
          )}
          style={{ color: 'var(--brown-soft)' }}
        >
          {expanded ? (
            <>
              <span className="font-body">Plan</span>
              <span className="text-mono-tag ml-auto" style={{ color: 'var(--accent-green)' }}>FREE</span>
            </>
          ) : (
            <span className="text-mono-tag" style={{ color: 'var(--accent-green)' }}>F</span>
          )}
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 no-underline text-[12px] font-body hover:bg-[rgba(0,0,0,0.04)]',
          )}
          style={{ color: 'var(--brown)' }}
        >
          <Settings size={16} strokeWidth={1.5} />
          {expanded && <span className="whitespace-nowrap animate-fi">Settings</span>}
        </Link>

        {/* Help */}
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[12px] font-body hover:bg-[rgba(0,0,0,0.04)] border-none cursor-pointer bg-transparent w-full text-left',
          )}
          style={{ color: 'var(--brown)' }}
        >
          <HelpCircle size={16} strokeWidth={1.5} />
          {expanded && <span className="whitespace-nowrap animate-fi">Help & Support</span>}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[12px] font-body hover:bg-[rgba(0,0,0,0.04)] border-none cursor-pointer bg-transparent w-full text-left relative',
          )}
          style={{ color: 'var(--brown)' }}
        >
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute top-1.5 left-6 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--red)' }} />
          {expanded && <span className="whitespace-nowrap animate-fi">Notifications</span>}
        </button>

        {/* Light/Dark toggle (disabled) */}
        {expanded && (
          <div
            className="flex items-center rounded-lg p-0.5 mt-1 animate-fi"
            style={{ backgroundColor: 'var(--cream-row-even)' }}
          >
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-body"
              style={{
                backgroundColor: 'var(--cream-card)',
                color: 'var(--brown)',
                border: 'none',
                cursor: 'default',
              }}
            >
              <Sun size={12} /> Light
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-body border-none cursor-default bg-transparent"
              style={{ color: 'var(--brown-light)' }}
            >
              <Moon size={12} /> Dark
            </button>
          </div>
        )}

        {/* User info */}
        <div
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 mt-1 rounded-lg',
            expanded && 'bg-[rgba(0,0,0,0.02)]'
          )}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
              color: 'var(--brown)',
            }}
          >
            K
          </div>
          {expanded && (
            <div className="flex flex-col min-w-0 animate-fi">
              <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--brown)' }}>
                Kolento Hou
              </span>
              <span className="text-[9px] truncate" style={{ color: 'var(--brown-soft)' }}>
                th2902@nyu.edu
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
