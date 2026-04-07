'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import {
  Search, LayoutDashboard, Briefcase, Trophy, Users, BarChart3,
  Settings, HelpCircle, Plus, FileText, UserPlus, ArrowRight,
} from 'lucide-react';

const NAV_COMMANDS = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, href: '/dashboard', shortcut: ['G', 'D'], group: 'Navigation' },
  { id: 'nav-roles', label: 'Go to Roles', icon: Briefcase, href: '/roles', shortcut: ['G', 'R'], group: 'Navigation' },
  { id: 'nav-candidates', label: 'Go to Candidates', icon: Users, href: '/candidates', shortcut: ['G', 'C'], group: 'Navigation' },
  { id: 'nav-assessments', label: 'Go to Assessments', icon: Trophy, href: '/assessment', shortcut: ['G', 'A'], group: 'Navigation' },
  { id: 'nav-evaluation', label: 'Go to Evaluation', icon: BarChart3, href: '/evaluation', shortcut: ['G', 'E'], group: 'Navigation' },
  { id: 'nav-settings', label: 'Go to Settings', icon: Settings, href: '/settings', shortcut: ['G', 'S'], group: 'Navigation' },
];

const CREATE_COMMANDS = [
  { id: 'create-role', label: 'Create Role', icon: Briefcase, href: '/roles/create', shortcut: ['C', 'R'], group: 'Create' },
  { id: 'create-assessment', label: 'Create Assessment', icon: Trophy, href: '/assessment/create', shortcut: ['C', 'A'], group: 'Create' },
  { id: 'add-candidate', label: 'Add Candidate', icon: UserPlus, action: 'openAddCandidateModal', shortcut: ['C', 'C'], group: 'Create' },
];

const ALL_COMMANDS = [...NAV_COMMANDS, ...CREATE_COMMANDS];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const router = useRouter();
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const assessments = useAppStore((s) => s.assessments);
  const openAddCandidateModal = useAppStore((s) => s.openAddCandidateModal);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return ALL_COMMANDS;

    const q = query.toLowerCase();
    const items = [];

    // Filter commands
    const matchedCommands = ALL_COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(q)
    );
    items.push(...matchedCommands);

    // Search roles
    const matchedRoles = roles.filter((r) =>
      r.title.toLowerCase().includes(q) || (r.dept || '').toLowerCase().includes(q)
    ).slice(0, 5).map((r) => ({
      id: 'role-' + r.id,
      label: r.title,
      sublabel: r.dept + ' · ' + r.status,
      icon: Briefcase,
      href: '/roles',
      group: 'Roles',
    }));
    items.push(...matchedRoles);

    // Search candidates
    const matchedCandidates = candidates.filter((c) =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    ).slice(0, 5).map((c) => ({
      id: 'candidate-' + c.id,
      label: c.name,
      sublabel: c.email,
      icon: Users,
      href: '/candidates',
      group: 'Candidates',
    }));
    items.push(...matchedCandidates);

    // Search assessments
    const matchedAssessments = assessments.filter((a) =>
      a.name.toLowerCase().includes(q) || (a.roleTitle || '').toLowerCase().includes(q)
    ).slice(0, 5).map((a) => ({
      id: 'assessment-' + a.id,
      label: a.name,
      sublabel: a.roleTitle,
      icon: Trophy,
      href: '/assessment/' + a.id,
      group: 'Assessments',
    }));
    items.push(...matchedAssessments);

    return items;
  }, [query, roles, candidates, assessments]);

  // Ensure activeIndex stays in bounds
  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(Math.max(0, results.length - 1));
  }, [results.length, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        executeItem(results[activeIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, activeIndex, results]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function executeItem(item) {
    onClose();
    if (item.action === 'openAddCandidateModal') {
      openAddCandidateModal();
    } else if (item.href) {
      router.push(item.href);
    }
  }

  if (!open) return null;

  // Group results
  const grouped = {};
  results.forEach((item) => {
    const group = item.group || 'Results';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(item);
  });

  let flatIndex = -1;

  return (
    <>
      {/* Backdrop — offset past sidebar so sidebar stays clear */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: sidebarWidth,
          backgroundColor: 'rgba(0,0,0,0.25)',
          zIndex: 100,
          backdropFilter: 'blur(3px)',
          animation: 'fi .1s ease both',
          transition: 'left 0.2s ease',
        }}
      />
      {/* Palette — positioned in upper third of the content area */}
      <div style={{
        position: 'fixed',
        top: '22%',
        left: `calc(${sidebarWidth}px + (100vw - ${sidebarWidth}px) / 2)`,
        transform: 'translateX(-50%)',
        width: 520,
        maxHeight: '60vh',
        backgroundColor: '#fff',
        borderRadius: 14,
        boxShadow: 'var(--shadow-modal)',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeScale .15s ease both',
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <Search size={16} style={{ color: 'var(--brown-soft)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Type a command or search..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              fontFamily: 'var(--font-body)', color: 'var(--brown)',
              backgroundColor: 'transparent',
            }}
          />
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--brown-soft)',
            backgroundColor: 'var(--cream)', padding: '2px 6px', borderRadius: 4,
            border: '1px solid var(--border-light)',
          }}>ESC</span>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: 'auto', padding: '6px 0', maxHeight: 400 }}>
          {results.length === 0 && (
            <div style={{
              padding: '24px 16px', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
            }}>
              No results found
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div style={{
                padding: '8px 16px 4px',
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {group}
              </div>
              {items.map((item) => {
                flatIndex++;
                const myIndex = flatIndex;
                const isActive = myIndex === activeIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    data-active={isActive}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setActiveIndex(myIndex)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px', cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--cream)' : 'transparent',
                      transition: 'background-color 0.08s ease',
                    }}
                  >
                    <Icon size={15} style={{ color: isActive ? 'var(--gold)' : 'var(--brown-soft)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: isActive ? 'var(--brown)' : 'var(--brown)',
                        fontWeight: isActive ? 500 : 400,
                      }}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: 11,
                          color: 'var(--brown-soft)', marginLeft: 8,
                        }}>
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                    {item.shortcut && (
                      <div style={{ display: 'flex', gap: 3 }}>
                        {item.shortcut.map((key, ki) => (
                          <span key={ki} style={{
                            fontSize: 10, fontFamily: 'var(--font-mono)',
                            color: 'var(--brown-soft)', backgroundColor: 'var(--cream)',
                            padding: '1px 5px', borderRadius: 3,
                            border: '1px solid var(--border-light)',
                            minWidth: 16, textAlign: 'center',
                          }}>
                            {key}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 16px', borderTop: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-soft)',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </>
  );
}
