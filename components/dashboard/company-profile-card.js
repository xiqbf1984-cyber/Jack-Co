'use client';

import Link from 'next/link';
import { Building2, Users, Link2, Pencil } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function CompanyProfileCard() {
  const company = useAppStore((s) => s.company);

  const isEmpty = !company.name || company.name === 'Your Company';
  const initial = (company.name || 'C').charAt(0).toUpperCase();

  if (isEmpty) {
    return (
      <div>
        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--brown)',
          marginBottom: 10,
        }}>Company Profile</h3>
        <div style={{
          padding: '24px 20px',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
          textAlign: 'center',
          animation: 'fsu .25s ease 0.1s both',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Building2 size={24} style={{ color: 'var(--brown-light)', marginBottom: 10 }} />
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown)',
            fontWeight: 600,
            marginBottom: 4,
          }}>Set up your company profile</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown-soft)',
            marginBottom: 14,
            lineHeight: 1.5,
            maxWidth: 220,
          }}>This info appears in JDs and candidate invitations.</div>
          <Link href="/settings/company" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '8px 24px',
            borderRadius: 8,
            border: '1px solid var(--border-default)',
            background: '#faf6ef',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--gold)',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>Complete Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--brown)',
        marginBottom: 10,
      }}>Company Profile</h3>
      <div style={{
        padding: '16px 18px',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: '#fff',
        animation: 'fsu .25s ease 0.1s both',
      }}>
        {/* Logo + Name + Industry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #8b6914, #c4a332)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
            }}>{initial}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
              fontWeight: 600,
              lineHeight: 1.3,
            }}>{company.name}</div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--brown-soft)',
            }}>{company.industry}</div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          {company.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Building2 size={11} style={{ color: 'var(--brown-light)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>
                {company.location}
              </span>
            </div>
          )}
          {company.size && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Users size={11} style={{ color: 'var(--brown-light)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>
                {company.size}
              </span>
            </div>
          )}
          {company.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link2 size={11} style={{ color: 'var(--brown-light)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>
                {company.website}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            color: 'var(--brown-soft)',
            lineHeight: 1.5,
            marginBottom: 10,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {company.description}
          </div>
        )}

        {/* Edit Profile Button */}
        <Link href="/settings/company" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          width: '100%',
          padding: '7px 0',
          borderRadius: 7,
          border: '1px solid var(--border-default)',
          background: '#faf6ef',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--gold)',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}>
          <Pencil size={11} style={{ color: 'var(--gold)' }} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
