import Sidebar from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: 200, minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
        {children}
      </main>
      <AddCandidateModal />
    </>
  );
}
