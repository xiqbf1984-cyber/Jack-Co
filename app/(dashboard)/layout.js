'use client';

import Sidebar from '@/components/layout/sidebar';
import { COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main style={{
        marginLeft: COLLAPSED_WIDTH,
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        transition: 'margin-left .25s cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '24px 5% 60px',
        }}>
          {children}
        </div>
      </main>
      <AddCandidateModal />
    </>
  );
}
