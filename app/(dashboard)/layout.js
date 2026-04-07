'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';
import CommandPalette from '@/components/ui/command-palette';
import NotificationPanel from '@/components/layout/notification-panel';
import HelpPanel from '@/components/layout/help-panel';
import { useAppStore } from '@/stores/app-store';

export default function DashboardLayout({ children }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const marginLeft = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Global ⌘K shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Sidebar
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenNotifications={() => setNotifOpen(!notifOpen)}
        onOpenHelp={() => setHelpOpen(!helpOpen)}
      />
      <main style={{
        marginLeft,
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        transition: 'margin-left 0.2s ease',
      }}>
        <div style={{
          padding: '32px 32px 64px',
        }}>
          {children}
        </div>
      </main>
      <AddCandidateModal />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
