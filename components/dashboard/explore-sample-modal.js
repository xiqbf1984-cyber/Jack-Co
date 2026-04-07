'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from '@/components/layout/sidebar';
import { X, ArrowRight } from 'lucide-react';

export default function ExploreSampleModal({ open, onClose }) {
  var user = useUser().user;
  var sidebarCollapsed = useAppStore(function (s) { return s.sidebarCollapsed; });
  var sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  var [loading, setLoading] = useState(false);

  if (!open) return null;

  var userEmail = user?.emailAddresses?.[0]?.emailAddress || 'you@example.com';
  var userName = user?.firstName || user?.username || 'You';

  function handleExplore() {
    setLoading(true);
    var store = useAppStore.getState();
    store.addRole({ title: 'Senior Full-Stack Engineer', dept: 'Engineering', salary: '$160k-$220k', status: 'active', jd: '# Senior Full-Stack Engineer\n\nBuild and scale our core platform.' });
    store.addRole({ title: 'AI Research Scientist', dept: 'Research', salary: '$180k-$260k', status: 'active', jd: '# AI Research Scientist\n\nPush the boundaries of applied AI.' });
    store.addRole({ title: 'Product Designer', dept: 'Design', salary: '$130k-$180k', status: 'draft' });
    store.addCandidate({ name: userName, email: userEmail, status: 'active', tz: 'PST' });
    store.addCandidate({ name: 'Alex Chen', email: 'alex@example.com', status: 'active', tz: 'EST' });
    store.addCandidate({ name: 'Sarah Kim', email: 'sarah@example.com', status: 'idle', tz: 'CST' });
    setTimeout(function () { setLoading(false); onClose(); }, 500);
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, left: sidebarWidth,
        backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
        zIndex: 90, transition: 'left 0.2s ease',
      }} />
      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: sidebarWidth, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 91, pointerEvents: 'none', transition: 'left 0.2s ease',
      }}>
        <div style={{
          width: 400, backgroundColor: '#fff', borderRadius: 14,
          boxShadow: 'var(--shadow-modal)', padding: '28px 24px',
          animation: 'fadeScale .2s ease both', pointerEvents: 'auto',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 24, height: 24, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--brown-light)',
          }}>
            <X size={14} />
          </button>

          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 600, color: 'var(--brown)', marginBottom: 8, textAlign: 'center' }}>
            Explore Sample Case
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', textAlign: 'center', lineHeight: 1.5, marginBottom: 20 }}>
            We'll load sample roles, candidates, and a ready-to-use hiring pipeline for you to explore.
          </p>

          <button
            onClick={handleExplore}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%', padding: '10px 20px', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Setting up...' : <>Get Started <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>
    </>
  );
}
