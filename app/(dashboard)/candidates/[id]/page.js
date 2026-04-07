'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { ArrowLeft, Mail, Globe, Calendar, ClipboardList, Briefcase, ChevronRight } from 'lucide-react';

export default function CandidateDetailPage() {
  var params = useParams();
  var candidates = useAppStore(function (s) { return s.candidates; });
  var assessments = useAppStore(function (s) { return s.assessments; });
  var openAddCandidateModal = useAppStore(function (s) { return s.openAddCandidateModal; });

  var candidate = useMemo(function () {
    return candidates.find(function (c) { return String(c.id) === String(params.id); });
  }, [candidates, params.id]);

  if (!candidate) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Link href="/candidates" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={13} /> Back to Candidates
        </Link>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--brown-soft)' }}>
            Candidate not found
          </p>
        </div>
      </div>
    );
  }

  var initials = candidate.avatar || candidate.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);

  // Find assessments this candidate is part of
  var candidateAssessments = assessments.filter(function (a) {
    return (a.candIds || []).includes(candidate.id);
  });

  var statusColor = candidate.status === 'active' ? 'var(--accent-green)' : candidate.status === 'completed' ? 'var(--accent-green)' : 'var(--brown-light)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/candidates" style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
          textDecoration: 'none',
        }}>Candidates</Link>
        <ChevronRight size={12} style={{ color: 'var(--brown-light)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 600 }}>
          {candidate.name}
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
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--brown)' }}>{initials}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600, color: 'var(--brown)' }}>
                {candidate.name}
              </h1>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
                fontFamily: 'var(--font-body)', color: statusColor,
                backgroundColor: statusColor === 'var(--accent-green)' ? 'rgba(39,130,91,0.08)' : 'rgba(0,0,0,0.04)',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: statusColor }} />
                {candidateAssessments.length} Assessment{candidateAssessments.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                <Mail size={11} /> {candidate.email}
              </span>
              {candidate.tz && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                  <Globe size={11} /> {candidate.tz}
                </span>
              )}
              {candidate.joined && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                  <Calendar size={11} /> Joined {candidate.joined}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href="/assessment/create" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '8px 16px', borderRadius: 8,
          backgroundColor: 'var(--gold)', color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          textDecoration: 'none', transition: 'opacity 0.15s ease',
        }}
          onMouseEnter={function (e) { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={function (e) { e.currentTarget.style.opacity = '1'; }}
        >
          Invite to Assessment
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
          { label: 'Assessments', value: candidateAssessments.length },
          { label: 'Average Score', value: '—' },
          { label: 'Last Active', value: candidate.lastActive || '—' },
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

      {/* Current Assessments */}
      <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Current Assessments
          </span>
        </div>

        {candidateAssessments.length > 0 ? (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
              padding: '8px 16px', backgroundColor: 'var(--cream)',
              borderBottom: '1px solid var(--border-light)',
            }}>
              {['Assessment', 'Status', 'Date', 'Actions'].map(function (h) {
                return <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'var(--brown-soft)' }}>{h}</span>;
              })}
            </div>
            {candidateAssessments.map(function (a) {
              var aStatusColor = a.status === 'active' || a.status === 'published' ? 'var(--accent-green)' : a.status === 'completed' ? 'var(--accent-green)' : 'var(--brown-light)';
              return (
                <div key={a.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
                  padding: '12px 16px', borderBottom: '1px solid var(--border-light)',
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>{a.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: aStatusColor }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                      {a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : ''}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                  </span>
                  <Link href={'/assessment/' + a.id} style={{
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
              No assessments assigned yet
            </div>
            <Link href="/assessment/create" className="btn-primary" style={{
              display: 'inline-flex', padding: '7px 16px', fontSize: 11, textDecoration: 'none',
            }}>Invite to Assessment</Link>
          </div>
        )}
      </div>

      {/* Assessment History */}
      <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Assessment History
          </span>
        </div>
        <div style={{
          padding: '48px 16px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            backgroundColor: 'rgba(139,105,20,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ClipboardList size={20} style={{ color: 'var(--brown-light)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            No assessment history
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>
            Completed assessments will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
