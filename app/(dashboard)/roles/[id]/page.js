'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { ArrowLeft, Briefcase, Calendar, ChevronRight, Users, FileText } from 'lucide-react';
import { STATUS_MAP } from '@/lib/constants';

export default function RoleDetailPage() {
  var params = useParams();
  var roles = useAppStore(function (s) { return s.roles; });
  var candidates = useAppStore(function (s) { return s.candidates; });
  var assessments = useAppStore(function (s) { return s.assessments; });

  var role = useMemo(function () {
    return roles.find(function (r) { return String(r.id) === String(params.id); });
  }, [roles, params.id]);

  if (!role) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Link href="/roles" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={13} /> Back to Roles
        </Link>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--brown-soft)' }}>
            Role not found
          </p>
        </div>
      </div>
    );
  }

  var statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
  var statusColor = 'var(--' + statusInfo.color + ')';

  // Find candidates linked to this role via assessments
  var roleAssessments = assessments.filter(function (a) { return a.roleId === role.id; });
  var linkedCandIdSet = new Set();
  roleAssessments.forEach(function (a) {
    (a.candIds || []).forEach(function (cid) { linkedCandIdSet.add(cid); });
  });
  var linkedCandidates = candidates.filter(function (c) { return linkedCandIdSet.has(c.id); });

  var createdDate = role.createdAt ? new Date(role.createdAt).toLocaleDateString() : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/roles" style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
          textDecoration: 'none',
        }}>Roles</Link>
        <ChevronRight size={12} style={{ color: 'var(--brown-light)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 600 }}>
          {role.title}
        </span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Briefcase size={20} style={{ color: 'var(--brown)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600, color: 'var(--brown)' }}>
                {role.title}
              </h1>
              {role.dept && (
                <span style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500,
                  fontFamily: 'var(--font-body)', color: 'var(--brown-soft)',
                  backgroundColor: 'var(--cream)',
                }}>
                  {role.dept}
                </span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
                fontFamily: 'var(--font-body)', color: statusColor,
                backgroundColor: statusColor === 'var(--accent-green)' ? 'rgba(39,130,91,0.08)' : 'rgba(0,0,0,0.04)',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: statusColor }} />
                {statusInfo.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                <Calendar size={11} /> Created {createdDate}
              </span>
            </div>
          </div>
        </div>
        <Link href={'/roles/create?id=' + role.id} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '8px 16px', borderRadius: 8,
          backgroundColor: 'var(--gold)', color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          textDecoration: 'none', transition: 'opacity 0.15s ease',
        }}
          onMouseEnter={function (e) { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={function (e) { e.currentTarget.style.opacity = '1'; }}
        >
          Edit JD
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
          { label: 'Candidates', value: linkedCandidates.length },
          { label: 'Status', value: statusInfo.label },
          { label: 'Created', value: createdDate },
        ].map(function (stat) {
          return (
            <div key={stat.label} style={{
              padding: '18px 20px', borderRadius: 12,
              border: '1px solid var(--border-default)', background: '#fff',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: 'var(--brown)' }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Job Description */}
      <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Job Description
          </span>
        </div>
        {role.jd ? (
          <div style={{ padding: '16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {role.jd}
          </div>
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              backgroundColor: 'rgba(139,105,20,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <FileText size={20} style={{ color: 'var(--brown-light)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginBottom: 12 }}>
              No job description yet
            </div>
            <Link href="/roles/create" className="btn-primary" style={{
              display: 'inline-flex', padding: '7px 16px', fontSize: 11, textDecoration: 'none',
            }}>Edit JD</Link>
          </div>
        )}
      </div>

      {/* Candidates */}
      <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Candidates
          </span>
        </div>

        {linkedCandidates.length > 0 ? (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
              padding: '8px 16px', backgroundColor: 'var(--cream)',
              borderBottom: '1px solid var(--border-light)',
            }}>
              {['Candidate', 'Status', 'Date', 'Actions'].map(function (h) {
                return <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'var(--brown-soft)' }}>{h}</span>;
              })}
            </div>
            {linkedCandidates.map(function (c) {
              var cStatusColor = c.status === 'active' || c.status === 'completed' ? 'var(--accent-green)' : 'var(--brown-light)';
              return (
                <div key={c.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
                  padding: '12px 16px', borderBottom: '1px solid var(--border-light)',
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>{c.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: cStatusColor }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                      {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : ''}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                    {c.joined || '—'}
                  </span>
                  <Link href={'/candidates/' + c.id} style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
                    textDecoration: 'none',
                  }}>View</Link>
                </div>
              );
            })}
          </>
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginBottom: 12 }}>
              No candidates assigned
            </div>
            <Link href="/candidates" className="btn-primary" style={{
              display: 'inline-flex', padding: '7px 16px', fontSize: 11, textDecoration: 'none',
            }}>Add Candidate</Link>
          </div>
        )}
      </div>
    </div>
  );
}
