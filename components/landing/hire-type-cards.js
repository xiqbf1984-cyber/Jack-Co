'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

export default function HireTypeCards() {
  const { isSignedIn } = useAuth();
  return (
    <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
      {/* Hiring Human */}
      <Link href={isSignedIn ? '/dashboard' : '/login'} style={{ textDecoration: 'none' }}>
        <div
          style={{
            width: 240,
            padding: '32px 24px',
            borderRadius: 16,
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--cream-card)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--brown)', marginBottom: 8 }}>
            Hiring Human
          </div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--brown-muted)' }}>
            Evaluate real candidates
          </div>
        </div>
      </Link>

      {/* Hiring AI */}
      <div
        style={{
          width: 240,
          padding: '32px 24px',
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--cream-card)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center',
          opacity: 0.45,
          cursor: 'default',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            letterSpacing: 0,
            color: 'var(--brown-soft)',
            backgroundColor: 'var(--cream-sidebar)',
            padding: '2px 8px',
            borderRadius: 9999,
          }}
        >
          Coming soon
        </span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--brown)', marginBottom: 8 }}>
          Hiring AI
        </div>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--brown-muted)' }}>
          Coming soon
        </div>
      </div>
    </div>
  );
}
