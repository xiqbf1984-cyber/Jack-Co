'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, BarChart3, Users as UsersIcon, FileText } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function CompanySettingsPage() {
  const company = useAppStore((s) => s.company);
  const setCompany = useAppStore((s) => s.setCompany);
  const router = useRouter();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => router.push('/settings')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--gold)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: 20,
        }}
      >
        <ArrowLeft size={14} />
        Back to Settings
      </button>

      {/* Header */}
      <h1 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--brown)',
        marginBottom: 4,
      }}>About your company</h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--brown-soft)',
        marginBottom: 24,
      }}>Edit your company details to help Jill know more about you</p>

      {/* Top cards row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14,
        marginBottom: 14,
      }}>
        {/* Name card */}
        <div style={{
          padding: '18px 20px',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Building2 size={14} style={{ color: '#c0392b' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--brown)',
            }}>Name</span>
          </div>
          <input
            type="text"
            value={company.name}
            onChange={(e) => setCompany({ name: e.target.value })}
            placeholder="Your Company"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
              background: 'transparent',
              padding: 0,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Industry card */}
        <div style={{
          padding: '18px 20px',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <BarChart3 size={14} style={{ color: '#0077B5' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--brown)',
            }}>Industry</span>
          </div>
          <input
            type="text"
            value={company.industry}
            onChange={(e) => setCompany({ industry: e.target.value })}
            placeholder="Software"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
              background: 'transparent',
              padding: 0,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Size card */}
        <div style={{
          padding: '18px 20px',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <UsersIcon size={14} style={{ color: '#8b6914' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--brown)',
            }}>Size</span>
          </div>
          <input
            type="text"
            value={company.size}
            onChange={(e) => setCompany({ size: e.target.value })}
            placeholder="e.g. 100, 1-50, 500+"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: company.size ? 'var(--brown)' : 'var(--brown-soft)',
              background: 'transparent',
              padding: 0,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Overview card */}
      <div style={{
        padding: '18px 20px',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <FileText size={14} style={{ color: '#27825b' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brown)',
          }}>Overview</span>
        </div>
        <textarea
          rows={5}
          value={company.description}
          onChange={(e) => setCompany({ description: e.target.value })}
          placeholder="Brief description of your company..."
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown)',
            background: 'transparent',
            padding: 0,
            resize: 'none',
            lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
