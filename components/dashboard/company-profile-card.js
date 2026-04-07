'use client';

import Link from 'next/link';
import { Building2, Users, Link2, Pencil } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function CompanyProfileCard() {
  const company = useAppStore((s) => s.company);
  const isEmpty = !company.name || company.name === 'Your Company';
  const initial = (company.name || 'C').charAt(0).toUpperCase();

  return (
    <div style={{
      borderRadius: 12, border: '1px solid var(--border-default)',
      background: '#fff', overflow: 'hidden',
    }}>
      {/* Header — matches other panels */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
          Hiring Profile
        </span>
        {!isEmpty && (
          <Link href="/settings/company" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 5,
            fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--gold)',
            textDecoration: 'none', transition: 'background-color 0.1s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Pencil size={10} /> Edit
          </Link>
        )}
      </div>

      {/* Content */}
      {isEmpty ? (
        <div style={{
          padding: '24px 20px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Building2 size={20} style={{ color: 'var(--brown-light)', marginBottom: 10 }} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
            Set up your hiring profile
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginBottom: 14, lineHeight: 1.5, maxWidth: 200 }}>
            This info appears in JDs and candidate invitations.
          </div>
          <Link href="/settings/company" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            gap: 5, padding: '7px 20px', borderRadius: 8,
            border: '1px solid var(--border-default)', background: '#faf6ef',
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
            textDecoration: 'none', transition: 'all 0.15s ease',
          }}>Complete Profile</Link>
        </div>
      ) : (
        <div style={{ padding: '14px 16px' }}>
          {/* Logo + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #8b6914, #c4a332)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)' }}>{initial}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 600, lineHeight: 1.3 }}>{company.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{company.industry}</div>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {company.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={10} style={{ color: 'var(--brown-light)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{company.location}</span>
              </div>
            )}
            {company.size && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={10} style={{ color: 'var(--brown-light)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{company.size}</span>
              </div>
            )}
            {company.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link2 size={10} style={{ color: 'var(--brown-light)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{company.website}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
