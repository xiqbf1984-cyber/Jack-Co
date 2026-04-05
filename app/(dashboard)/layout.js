import Sidebar from '@/components/layout/sidebar';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main
        className="flex-1 min-h-screen"
        style={{ backgroundColor: 'var(--cream)', marginLeft: 60, overflowX: 'hidden' }}
      >
        {children}
      </main>
      <AddCandidateModal />
    </div>
  );
}
