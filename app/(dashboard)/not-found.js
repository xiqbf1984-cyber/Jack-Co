import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600,
        color: 'var(--brown)',
      }}>
        Page not found
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
      }}>
        The page you're looking for doesn't exist.
      </div>
      <Link href="/dashboard" className="btn-primary" style={{
        padding: '8px 20px', fontSize: 12, textDecoration: 'none',
      }}>
        Go to Dashboard
      </Link>
    </div>
  );
}
