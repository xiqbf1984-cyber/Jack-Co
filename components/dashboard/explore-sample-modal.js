'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from '@/components/layout/sidebar';
import { Briefcase, Users, ClipboardCheck, Compass, X, CheckCircle } from 'lucide-react';

export default function ExploreSampleModal({ open, onClose }) {
  const { user } = useUser();
  const router = useRouter();
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || 'you@example.com';
  const userName = user?.firstName || user?.username || 'You';

  function handleExplore() {
    setLoading(true);
    const { addRole, addCandidate } = useAppStore.getState();

    // Add sample roles with JDs
    addRole({
      title: 'Senior Full-Stack Engineer',
      dept: 'Engineering',
      salary: '$160k-$220k',
      status: 'active',
      jd: '# Senior Full-Stack Engineer\n\nWe are looking for a Senior Full-Stack Engineer to build and scale our core platform...',
    });
    addRole({
      title: 'AI Research Scientist',
      dept: 'Research',
      salary: '$180k-$260k',
      status: 'active',
      jd: '# AI Research Scientist\n\nJoin our research team to push the boundaries of applied AI...',
    });
    addRole({
      title: 'Product Designer',
      dept: 'Design',
      salary: '$130k-$180k',
      status: 'draft',
    });

    // Add candidates including the current user
    addCandidate({ name: userName, email: userEmail, status: 'active', tz: 'PST' });
    addCandidate({ name: 'Alex Chen', email: 'alex@example.com', status: 'active', tz: 'EST' });
    addCandidate({ name: 'Sarah Kim', email: 'sarah@example.com', status: 'idle', tz: 'CST' });

    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 500);
  }

  return (
    <>
      {/* Backdrop — sidebar stays clear */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          left: sidebarWidth,
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          animation: 'fi .15s ease both',
          transition: 'left 0.2s ease',
        }}
      />
      {/* Modal — centered in content area */}
      <div style={{
        position: 'fixed',
        top: 0, bottom: 0,
        left: sidebarWidth, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 91, pointerEvents: 'none',
        transition: 'left 0.2s ease',
      }}>
        <div style={{
          width: 440, maxWidth: 'calc(100vw - 80px)',
          backgroundColor: '#fff', borderRadius: 16,
          boxShadow: 'var(--shadow-modal)',
          padding: '36px 32px',
          animation: 'fadeScale .2s ease both',
          pointerEvents: 'auto',
        }}>
          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            width: 28, height: 28, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--brown-soft)',
          }}>
            <X size={16} />
          </button>

          {/* Content */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Compass size={22} style={{ color: '#fff' }} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600,
              color: 'var(--brown)', marginBottom: 6,
            }}>
              Try a Sample Hiring Pipeline
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)',
              lineHeight: 1.6, marginBottom: 24,
            }}>
              We'll set up a complete sample for you to explore.<br />
              You can always delete it later.
            </p>
          </div>

          {/* What you'll get */}
          <div style={{
            borderRadius: 10, backgroundColor: 'var(--cream)',
            padding: '14px 16px', marginBottom: 24,
          }}>
            {[
              { icon: Briefcase, text: '3 hiring roles with job descriptions' },
              { icon: Users, text: 'Candidates including ' + userEmail },
              { icon: ClipboardCheck, text: 'Ready to create your first assessment' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 0',
                }}>
                  <Icon size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action */}
          <button
            onClick={handleExplore}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%', padding: '11px 20px', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <><CheckCircle size={14} /> Setting up...</>
            ) : (
              <><Compass size={14} /> Explore Sample Case</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
