'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Palette, Globe, ChevronRight, Building2 } from 'lucide-react';

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: 'none',
        backgroundColor: value ? 'var(--accent-green)' : 'var(--border-default)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: 2,
        left: value ? 20 : 2,
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
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
        }}>Manage your application preferences</p>
      </div>

      {/* Company Profile link */}
      <Link href="/settings/company" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'rgba(139,105,20,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
              Company & Hiring Manager Profile
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>
              Edit company details, industry, and your hiring manager info
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--brown-light)' }} />
        </div>
      </Link>

      {/* Notifications */}
      <div style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: '#fff',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={15} style={{ color: 'var(--brown)' }} />
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>Notifications</h3>
          </div>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Email notifications</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>Receive updates about assessments and candidates</div>
          </div>
          <ToggleSwitch value={emailNotifs} onChange={setEmailNotifs} />
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Push notifications</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>Browser notifications for real-time updates</div>
          </div>
          <ToggleSwitch value={pushNotifs} onChange={setPushNotifs} />
        </div>
      </div>

      {/* Security */}
      <div style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: '#fff',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={15} style={{ color: 'var(--brown)' }} />
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>Security</h3>
          </div>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Two-factor authentication</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>Add an extra layer of security to your account</div>
          </div>
          <ToggleSwitch value={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>

      {/* Appearance */}
      <div style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: '#fff',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Palette size={15} style={{ color: 'var(--brown)' }} />
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>Appearance</h3>
          </div>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Dark mode</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 2 }}>Switch to a darker color scheme</div>
          </div>
          <ToggleSwitch value={darkMode} onChange={setDarkMode} />
        </div>
      </div>
    </div>
  );
}
