import Sidebar from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, backgroundColor: 'var(--cream)' }}>
        {children}
      </main>
      <AddCandidateModal />
    </div>
  );
}
