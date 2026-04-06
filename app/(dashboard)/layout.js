'use client';

import Sidebar from '@/components/layout/sidebar';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';
import { useAppStore } from '@/stores/app-store';

export default function DashboardLayout({ children }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const marginLeft = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <>
      <Sidebar />
      <main style={{
        marginLeft,
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        transition: 'margin-left 0.2s ease',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '32px 5% 64px',
        }}>
          {children}
        </div>
      </main>
      <AddCandidateModal />
    </>
  );
}
