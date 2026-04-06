'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { Upload, Link as LinkIcon, User, ArrowLeft } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back link */}
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--gold)',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--brown)',
        }}>Settings</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-soft)',
          marginTop: 4,
        }}>Your hiring manager profile and preferences</p>
      </div>

      {/* Card container */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        border: '1px solid var(--border-default)',
        padding: '28px 32px',
        maxWidth: 720,
      }}>
        {/* Input mode tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = inputMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setInputMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: `1px solid ${isActive ? 'var(--border-hover)' : 'var(--border-default)'}`,
                  backgroundColor: isActive ? 'var(--cream-card)' : 'transparent',
                  color: isActive ? 'var(--brown)' : 'var(--brown-soft)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
          <div style={{
            border: '2px dashed var(--border-default)',
            borderRadius: 12,
            padding: '40px 20px',
            textAlign: 'center',
            marginBottom: 24,
            animation: 'fsu .2s ease',
          }}>
            <Upload size={32} style={{ color: 'var(--brown-soft)', marginBottom: 12 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginBottom: 16 }}>
              Upload your resume to auto-fill your profile
            </p>
            <label className="btn-primary" style={{ cursor: 'pointer' }}>
              Choose File
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            {hm.resumeFileName && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--accent-green)', marginTop: 12 }}>
                Uploaded: {hm.resumeFileName}
              </p>
            )}
          </div>
        )}

        {/* LinkedIn URL */}
        {inputMode === 'linkedin' && (
          <div style={{ marginBottom: 24, animation: 'fsu .2s ease' }}>
            <label style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)',
              display: 'block', marginBottom: 8,
            }}>LinkedIn Profile URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={hm.linkedinUrl}
              onChange={(e) => setHM({ linkedinUrl: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 6 }}>
              We'll extract your public profile information.
            </p>
          </div>
        )}

        {/* Section title */}
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--brown)',
          marginBottom: 20,
          paddingBottom: 10,
          borderBottom: '1px solid var(--border-light)',
        }}>Personal Information</h3>

        {/* Form fields */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px 24px',
          marginBottom: 24,
        }}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Sarah Chen' },
            { key: 'title', label: 'Title', placeholder: 'VP of Engineering' },
            { key: 'department', label: 'Department', placeholder: 'Machine Learning Platform' },
            { key: 'reportsTo', label: 'Reports To', placeholder: 'CTO' },
          ].map((field) => (
            <div key={field.key}>
              <label style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)',
                display: 'block', marginBottom: 8,
              }}>{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={hm[field.key]}
                onChange={(e) => setHM({ [field.key]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {/* LinkedIn URL (in manual mode) */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)',
            display: 'block', marginBottom: 8,
          }}>LinkedIn URL</label>
          <input
            type="url"
            placeholder="linkedin.com/in/sarahchen"
            value={hm.linkedinUrl}
            onChange={(e) => setHM({ linkedinUrl: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 10,
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--cream)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button className="btn-primary">Save Profile</button>
      </div>
    </div>
  );
}
