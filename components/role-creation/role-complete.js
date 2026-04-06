'use client';

import Link from 'next/link';
import { CheckCircle, Star, PlusCircle } from 'lucide-react';

export default function RoleComplete({ roleTitle = 'New Role', roleData }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-6 py-16"
      style={{ animation: 'fadeScale 0.4s ease-out' }}
    >
      {/* Success icon */}
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'rgba(39, 130, 91, 0.1)',
        }}
      >
        <CheckCircle size={32} style={{ color: 'var(--accent-green)' }} />
      </div>

      {/* Title */}
      <h1 className="text-display-page mb-2">Role Created</h1>
      <p className="text-body-lg mb-10 text-center" style={{ color: 'var(--brown-muted)', maxWidth: 460 }}>
        Your JD has been saved. What would you like to do next?
      </p>

      {/* Action cards */}
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: 460 }}>
        {/* Create an Assessment */}
        <Link
          href="/assessment/create"
          className="flex items-center gap-4 rounded-xl no-underline transition-all"
          style={{
            padding: '18px 20px',
            border: '1.5px solid rgba(39, 130, 91, 0.33)',
            backgroundColor: 'rgba(39, 130, 91, 0.06)',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(39, 130, 91, 0.18)',
            }}
          >
            <Star size={18} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <div className="font-semibold text-body-sm" style={{ color: 'var(--brown)' }}>
              Create an Assessment
            </div>
            <div className="text-body-xs mt-0.5" style={{ color: 'var(--brown-muted)' }}>
              Set up an AI assessment for this role
            </div>
          </div>
        </Link>

        {/* Create Another Role */}
        <Link
          href="/roles/create"
          className="flex items-center gap-4 rounded-xl no-underline transition-all"
          style={{
            padding: '18px 20px',
            border: '1.5px solid rgba(139, 105, 20, 0.33)',
            backgroundColor: 'rgba(139, 105, 20, 0.06)',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(139, 105, 20, 0.18)',
            }}
          >
            <PlusCircle size={18} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <div className="font-semibold text-body-sm" style={{ color: 'var(--brown)' }}>
              Create Another Role
            </div>
            <div className="text-body-xs mt-0.5" style={{ color: 'var(--brown-muted)' }}>
              Start a new JD from scratch
            </div>
          </div>
        </Link>

        {/* Go to Dashboard */}
        <div className="text-center mt-4">
          <Link
            href="/dashboard"
            className="text-body-sm no-underline transition-colors"
            style={{ color: 'var(--brown-muted)' }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
