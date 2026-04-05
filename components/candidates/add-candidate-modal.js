'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { X } from 'lucide-react';

export default function AddCandidateModal() {
  const open = useAppStore((s) => s.addCandidateModalOpen);
  const close = useAppStore((s) => s.closeAddCandidateModal);
  const addCandidate = useAppStore((s) => s.addCandidate);

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
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 animate-fi" />

      {/* Modal */}
      <div
        className="relative rounded-2xl border p-6 animate-fade-scale"
        style={{
          width: 420,
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer bg-transparent hover-bg-dim transition-colors"
          style={{ color: 'var(--brown-soft)' }}
        >
          <X size={16} />
        </button>

        <h2 className="font-display text-[18px] mb-1" style={{ color: 'var(--brown)' }}>
          Add Candidate
        </h2>
        <p className="text-body-xs mb-5">Add a new candidate to your pool.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-mono-label block mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none transition-all font-body focus-border-hover"
              style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              required
            />
          </div>
          <div className="mb-6">
            <label className="text-mono-label block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none transition-all font-body focus-border-hover"
              style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Candidate</button>
          </div>
        </form>
      </div>
    </div>
  );
}
