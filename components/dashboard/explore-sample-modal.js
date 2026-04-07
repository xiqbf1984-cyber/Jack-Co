'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from '@/components/layout/sidebar';
import { X, CheckCircle, Briefcase, Users, ClipboardCheck, ArrowRight } from 'lucide-react';

export default function ExploreSampleModal({ open, onClose }) {
  var user = useUser().user;
  var router = useRouter();
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

  var steps = [
    { num: '1', icon: Briefcase, title: 'Roles & JDs', desc: '3 sample hiring roles with AI-generated job descriptions' },
    { num: '2', icon: Users, title: 'Candidates', desc: 'Sample candidates including ' + userEmail },
    { num: '3', icon: ClipboardCheck, title: 'Assessment Ready', desc: 'Everything set up to create your first assessment' },
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, left: sidebarWidth,
        backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
        zIndex: 90, animation: 'fi .15s ease both', transition: 'left 0.2s ease',
      }} />
      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: sidebarWidth, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 91, pointerEvents: 'none', transition: 'left 0.2s ease',
      }}>
        <div style={{
          width: 460, maxWidth: 'calc(100vw - 80px)',
          backgroundColor: '#fff', borderRadius: 16,
          boxShadow: 'var(--shadow-modal)', padding: '32px',
          animation: 'fadeScale .2s ease both', pointerEvents: 'auto',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            width: 28, height: 28, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--brown-soft)',
          }}>
            <X size={16} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)', marginBottom: 6 }}>
              Try a Sample Hiring Pipeline
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', lineHeight: 1.5 }}>
              We'll set up a complete sample for you to explore.
            </p>
          </div>

          {/* Step cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {steps.map(function (step) {
              var Icon = step.icon;
              return (
                <div key={step.num} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 10,
                  border: '1px solid var(--border-light)', background: '#fff',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    backgroundColor: 'rgba(139,105,20,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2, lineHeight: 1.4 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
              <>Explore Sample Case <ArrowRight size={14} /></>
            )}
          </button>

          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)',
            textAlign: 'center', marginTop: 12,
          }}>
            You can delete sample data anytime
          </div>
        </div>
      </div>
    </>
  );
}
