'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { EXPANDED_WIDTH, COLLAPSED_WIDTH } from '@/components/layout/sidebar';
import { X } from 'lucide-react';

export default function AddCandidateModal() {
  const open = useAppStore((s) => s.addCandidateModalOpen);
  const close = useAppStore((s) => s.closeAddCandidateModal);
  const addCandidate = useAppStore((s) => s.addCandidate);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    addCandidate({
      name,
      email,
      status: 'pending',
      tz: 'EST',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avatar: initials,
    });
    setName('');
    setEmail('');
    close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ paddingLeft: sidebarWidth, transition: 'padding-left 0.2s ease' }}
      onClick={close}
    >
      <div className="absolute inset-0 bg-black/20 animate-fi" />

      <div
        className="relative rounded-xl border animate-fade-scale"
        style={{
          width: 380,
          padding: '20px 24px',
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center border-none cursor-pointer bg-transparent hover-bg-dim transition-colors"
          style={{ color: 'var(--brown-soft)' }}
        >
          <X size={14} />
        </button>

        <h2 className="text-display-section mb-0.5" style={{ color: 'var(--brown)' }}>
          Add Candidate
        </h2>
        <p className="text-body-xs mb-4">Add a new candidate to your pool.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-body-xs font-medium block mb-1" style={{ color: 'var(--brown)' }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border text-body-sm outline-none transition-all font-body focus-border-hover"
              style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              required
            />
          </div>
          <div className="mb-5">
            <label className="text-body-xs font-medium block mb-1" style={{ color: 'var(--brown)' }}>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border text-body-sm outline-none transition-all font-body focus-border-hover"
              style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              required
            />
          </div>
          <div className="flex gap-2.5 justify-end">
            <button type="button" onClick={close} className="btn-secondary" style={{ padding: '6px 14px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 14px' }}>Add Candidate</button>
          </div>
        </form>
      </div>
    </div>
  );
}
