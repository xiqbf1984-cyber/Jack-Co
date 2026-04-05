'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Upload, Link as LinkIcon, User } from 'lucide-react';

export default function SettingsPage() {
  const hm = useAppStore((s) => s.hiringManager);
  const setHM = useAppStore((s) => s.setHiringManager);
  const [inputMode, setInputMode] = useState('manual');

  const modes = [
    { id: 'resume', label: 'Upload Resume', icon: Upload },
    { id: 'linkedin', label: 'LinkedIn URL', icon: LinkIcon },
    { id: 'manual', label: 'Manual Entry', icon: User },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHM({ resumeFileName: file.name });
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <h1 className="text-display-page mb-2">Settings</h1>
      <p className="text-body-lg mb-8">Your hiring manager profile.</p>

      {/* Input mode tabs */}
      <div className="flex gap-3 mb-8">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setInputMode(mode.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-body-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: inputMode === mode.id ? 'var(--cream-card)' : 'transparent',
                borderColor: inputMode === mode.id ? 'var(--border-hover)' : 'var(--border-default)',
                color: inputMode === mode.id ? 'var(--brown)' : 'var(--brown-soft)',
                boxShadow: inputMode === mode.id ? 'var(--shadow-card)' : 'none',
              }}
            >
              <Icon size={14} />
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Resume upload */}
      {inputMode === 'resume' && (
        <div
          className="rounded-xl border-2 border-dashed p-10 text-center mb-8 animate-fsu"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <Upload size={36} style={{ color: 'var(--brown-soft)' }} className="mx-auto mb-4" />
          <p className="text-body-sm mb-4" style={{ color: 'var(--brown-soft)' }}>
            Upload your resume to auto-fill your profile
          </p>
          <label className="btn-primary cursor-pointer">
            Choose File
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>
          {hm.resumeFileName && (
            <p className="text-body-xs mt-4" style={{ color: 'var(--accent-green)' }}>
              Uploaded: {hm.resumeFileName}
            </p>
          )}
        </div>
      )}

      {/* LinkedIn URL */}
      {inputMode === 'linkedin' && (
        <div className="mb-8 animate-fsu">
          <label className="text-mono-label block mb-2">LinkedIn Profile URL</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={hm.linkedinUrl}
            onChange={(e) => setHM({ linkedinUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body"
            style={{
              backgroundColor: 'var(--cream-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--brown)',
            }}
          />
          <p className="text-body-xs mt-2">We'll extract your public profile information.</p>
        </div>
      )}

      {/* Manual fields */}
      <div className="animate-fsu">
        <h3 className="text-display-section mb-3">Personal Information</h3>
        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Sarah Chen' },
            { key: 'title', label: 'Title', placeholder: 'VP of Engineering' },
            { key: 'department', label: 'Department', placeholder: 'Machine Learning Platform' },
            { key: 'reportsTo', label: 'Reports To', placeholder: 'CTO' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-mono-label block mb-2">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={hm[field.key]}
                onChange={(e) => setHM({ [field.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
                style={{
                  backgroundColor: 'var(--cream-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--brown)',
                }}
              />
            </div>
          ))}
        </div>

        {inputMode === 'manual' && (
          <div className="mb-8">
            <label className="text-mono-label block mb-2">LinkedIn URL</label>
            <input
              type="url"
              placeholder="linkedin.com/in/sarahchen"
              value={hm.linkedinUrl}
              onChange={(e) => setHM({ linkedinUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border text-body-sm outline-none transition-all duration-200 font-body focus-border-hover"
              style={{
                backgroundColor: 'var(--cream-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--brown)',
              }}
            />
          </div>
        )}

        <button className="btn-primary">Save Profile</button>
      </div>
    </div>
  );
}
