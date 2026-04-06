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
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#1a1612',
          marginBottom: 12,
        }}>Company Profile</h3>
        <div style={{
          padding: '28px 22px',
          borderRadius: 14,
          border: '1px solid var(--border-default)',
          background: '#fff',
          textAlign: 'center',
          animation: 'fsu .25s ease 0.1s both',
        }}>
          <Building2 size={28} style={{ color: '#c4b896', marginBottom: 12 }} />
          <div style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 13,
            color: '#1a1612',
            fontWeight: 600,
            marginBottom: 6,
          }}>Set up your company profile</div>
          <div style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 11,
            color: '#9a9184',
            marginBottom: 16,
            lineHeight: 1.6,
          }}>This info appears in JDs and candidate invitations.</div>
          <Link href="/settings/company" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            width: '100%',
            padding: '9px 0',
            borderRadius: 8,
            border: '1px solid var(--border-default)',
            background: '#faf6ef',
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 11,
            color: '#8b6914',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>Complete Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 16,
        fontWeight: 700,
        color: '#1a1612',
        marginBottom: 12,
      }}>Company Profile</h3>
      <div style={{
        padding: '18px 20px',
        borderRadius: 14,
        border: '1px solid var(--border-default)',
        background: '#fff',
        animation: 'fsu .25s ease 0.1s both',
      }}>
        {/* Logo + Name + Industry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #8b6914, #c4a332)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>{initial}</span>
          </div>
          <div>
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 14,
              color: '#1a1612',
              fontWeight: 600,
            }}>{company.name}</div>
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 10,
              color: '#9a9184',
            }}>{company.industry}</div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: company.description ? 0 : 12 }}>
          {company.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={12} style={{ color: '#c4b896' }} />
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#9a9184' }}>
                {company.location}
              </span>
            </div>
          )}
          {company.size && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={12} style={{ color: '#c4b896' }} />
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#9a9184' }}>
                {company.size}
              </span>
            </div>
          )}
          {company.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link2 size={12} style={{ color: '#c4b896' }} />
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#9a9184' }}>
                {company.website}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <div style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 11,
            color: '#9a9184',
            lineHeight: 1.6,
            marginTop: 12,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 3,
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
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: '#faf6ef',
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: 11,
          color: '#8b6914',
          textDecoration: 'none',
          cursor: 'pointer',
          marginTop: 12,
        }}>
          <Pencil size={12} style={{ color: '#8b6914' }} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
