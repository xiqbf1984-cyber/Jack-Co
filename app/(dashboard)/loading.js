export default function DashboardLoading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
        animation: 'fi .3s ease both',
      }}>
        Loading...
      </div>
    </div>
  );
}
