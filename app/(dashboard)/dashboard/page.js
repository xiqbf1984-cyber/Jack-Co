'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/app-store';
import StatCards from '@/components/dashboard/stat-cards';
import CompanyProfileCard from '@/components/dashboard/company-profile-card';
import ExploreSampleModal from '@/components/dashboard/explore-sample-modal';
import {
  FileText, Plus, Briefcase, Users, Compass, Eye,
} from 'lucide-react';

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function DashboardPage() {
  const { user } = useUser();
  const company = useAppStore((s) => s.company);
  const roles = useAppStore((s) => s.roles);
  const candidates = useAppStore((s) => s.candidates);
  const assessments = useAppStore((s) => s.assessments);
  const dataInitialized = useAppStore((s) => s.dataInitialized);
  const draft = useAppStore((s) => s.draft);
  const loadDraft = useAppStore((s) => s.loadDraft);
  const clearDraft = useAppStore((s) => s.clearDraft);
  const openAddCandidateModal = useAppStore((s) => s.openAddCandidateModal);
  const router = useRouter();
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  useEffect(() => { loadDraft(); }, [loadDraft]);

  // Use Clerk user name, then fall back to company name
  const userName = user?.firstName || user?.username || null;
  const displayName = userName || (company.name && company.name !== 'Your Company' ? company.name : 'there');

  // ─── Loading: prevent flash ───
  if (!dataInitialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', animation: 'fi .3s ease both' }}>
          Loading...
        </div>
      </div>
    );
  }

  const isZeroData = roles.length === 0 && candidates.length === 0 && assessments.length === 0;

  // ─── Zero-data onboarding ───
  if (isZeroData) {
    return (
      <>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '75vh', gap: 32,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Briefcase size={24} style={{ color: '#fff' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)', marginBottom: 6 }}>
              Get Started
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
              Choose how you want to begin with NeoHuman
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 600 }}>
            {/* Recommended: Explore Sample */}
            <div style={{
              borderRadius: 14, border: '1px solid var(--border-default)',
              background: '#fff', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              position: 'relative', animation: 'fsu .25s ease both',
            }}>
              <span style={{
                position: 'absolute', top: -10, left: 16,
                padding: '2px 10px', borderRadius: 6,
                background: 'var(--gold)', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              }}>Recommended</span>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                backgroundColor: 'rgba(139,105,20,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Compass size={16} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
                  Explore Sample Case
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.5 }}>
                  Experience the full hiring workflow with sample data.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {[
                  { icon: Briefcase, text: 'Pre-built roles & JDs' },
                  { icon: Users, text: 'Sample candidates' },
                  { icon: Eye, text: 'See the full pipeline' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={12} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>{item.text}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setSampleModalOpen(true)} className="btn-primary" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 20px', fontSize: 12, width: '100%', marginTop: 'auto',
              }}>
                <Compass size={13} /> Explore Sample
              </button>
            </div>

            {/* Create a Role */}
            <div style={{
              borderRadius: 14, border: '1px solid var(--border-default)',
              background: '#fff', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              animation: 'fsu .25s ease 0.05s both',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                backgroundColor: 'rgba(139,105,20,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={16} style={{ color: 'var(--brown-soft)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
                  Create a Role
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.5 }}>
                  Define a position and generate a JD with AI.
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <Link href="/roles/create" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 8,
                border: '1px solid var(--border-default)', background: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                color: 'var(--brown)', textDecoration: 'none',
                transition: 'all 0.15s ease', width: '100%', boxSizing: 'border-box',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Plus size={13} /> Create
              </Link>
            </div>
          </div>
        </div>
        <ExploreSampleModal open={sampleModalOpen} onClose={() => setSampleModalOpen(false)} />
      </>
    );
  }

  // ─── Normal dashboard ───
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>
          Welcome back, {displayName}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>
          Manage your roles, candidates, and assessments
        </p>
      </div>

      {/* Draft Recovery */}
      {draft && (
        <div style={{
          background: 'rgba(139,105,20,0.08)', border: '1px solid rgba(139,105,20,0.22)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14, animation: 'fsu .3s ease both',
        }}>
          <FileText size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 600 }}>
              You have an unfinished assessment{draft.data?.currentStep != null && ` (Step ${draft.data.currentStep + 1} of 8)`}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginTop: 2 }}>
              Last edited {formatTimeAgo(draft.savedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/assessment/create')} className="btn-primary" style={{ padding: '7px 16px', fontSize: 11 }}>Continue</button>
            <button onClick={clearDraft} className="btn-secondary" style={{ padding: '7px 16px', fontSize: 11 }}>Discard</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <StatCards />

      {/* Row 1: Roles + Candidates + Hiring Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: 16, alignItems: 'start' }}>
        <DashboardPanel title="Roles" count={roles.length} addLabel="Create" addHref="/roles/create" viewAllHref="/roles">
          {roles.length > 0 ? roles.slice(0, 3).map((role) => (
            <PanelRow key={role.id} label={role.title} sublabel={role.dept} status={role.status} />
          )) : <PanelEmpty message="No roles yet" />}
        </DashboardPanel>

        <DashboardPanel title="Candidates" count={candidates.length} addLabel="Add" onAdd={openAddCandidateModal} viewAllHref="/candidates">
          {candidates.length > 0 ? candidates.slice(0, 3).map((c) => (
            <PanelRow key={c.id} label={c.name} sublabel={c.email} status={c.status} />
          )) : <PanelEmpty message="No candidates yet" />}
        </DashboardPanel>

        <CompanyProfileCard />
      </div>

      {/* Row 2: Assessments — full width, single-column table with role + candidate avatars */}
      <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>Assessments</span>
            {assessments.length > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-soft)', backgroundColor: 'var(--cream)', padding: '1px 6px', borderRadius: 4 }}>{assessments.length}</span>}
          </div>
          <Link href="/assessment/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 6,
            backgroundColor: 'var(--gold)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
            textDecoration: 'none', transition: 'opacity 0.15s ease',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
            <Plus size={10} /> Create
          </Link>
        </div>

        {/* Table header */}
        {assessments.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.6fr',
            padding: '8px 16px', backgroundColor: 'var(--cream)',
            borderBottom: '1px solid var(--border-light)',
          }}>
            {['Assessment', 'Role', 'Candidates', 'Status'].map((h) => (
              <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'var(--brown-soft)' }}>{h}</span>
            ))}
          </div>
        )}

        {/* Rows */}
        {assessments.length > 0 ? assessments.slice(0, 5).map((a) => {
          const candCount = a.candIds?.length || 0;
          return (
            <div key={a.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.6fr',
              padding: '10px 16px', borderBottom: '1px solid var(--border-light)',
              alignItems: 'center', transition: 'background-color 0.1s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.name}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.roleTitle || '—'}
              </div>
              {/* Candidate avatars */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {candCount > 0 ? (
                  <>
                    {(a.candIds || []).slice(0, 3).map((id, ci) => (
                      <div key={id} style={{
                        width: 22, height: 22, borderRadius: '50%',
                        backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'][ci % 4],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginLeft: ci > 0 ? -6 : 0, border: '2px solid #fff',
                        zIndex: 3 - ci, flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 7, fontWeight: 600, color: '#fff' }}>
                          {String(id).slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {candCount > 3 && (
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        backgroundColor: 'var(--cream)', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginLeft: -6, zIndex: 0, flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--brown-soft)' }}>
                          +{candCount - 3}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>—</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: STATUS_COLORS[a.status] || 'var(--brown-light)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>
                  {a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : ''}
                </span>
              </div>
            </div>
          );
        }) : (
          <PanelEmpty message="No assessments yet" />
        )}

        {/* Footer */}
        {assessments.length > 5 && (
          <Link href="/assessment" style={{
            display: 'block', padding: '10px 16px', borderTop: '1px solid var(--border-light)',
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)', textDecoration: 'none', textAlign: 'center',
          }}>
            See all {assessments.length} ›
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Reusable panel ───
function DashboardPanel({ title, count, addLabel, addHref, onAdd, viewAllHref, children }) {
  const btn = addHref ? (
    <Link href={addHref} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6,
      backgroundColor: 'var(--gold)', color: '#fff',
      fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
      textDecoration: 'none', transition: 'opacity 0.15s ease',
    }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
      <Plus size={10} /> {addLabel}
    </Link>
  ) : onAdd ? (
    <button onClick={onAdd} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6,
      backgroundColor: 'var(--gold)', color: '#fff',
      fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
      border: 'none', cursor: 'pointer', transition: 'opacity 0.15s ease',
    }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
      <Plus size={10} /> {addLabel}
    </button>
  ) : null;

  return (
    <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>{title}</span>
          {count > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-soft)', backgroundColor: 'var(--cream)', padding: '1px 6px', borderRadius: 4 }}>{count}</span>}
        </div>
        {btn}
      </div>
      <div>{children}</div>
      {count > 3 && viewAllHref && (
        <Link href={viewAllHref} style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)', textDecoration: 'none', textAlign: 'center' }}>
          See all {count} ›
        </Link>
      )}
    </div>
  );
}

const STATUS_COLORS = {
  active: 'var(--accent-green)', completed: 'var(--accent-green)', draft: 'var(--brown-light)',
  idle: 'var(--brown-light)', published: 'var(--accent-green)', expired: 'var(--red)', archived: 'var(--brown-light)',
};

function PanelRow({ label, sublabel, status }) {
  const color = STATUS_COLORS[status] || 'var(--brown-light)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.1s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
        {sublabel && <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sublabel}</div>}
      </div>
      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: color }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      )}
    </div>
  );
}

function PanelEmpty({ message }) {
  return (
    <div style={{ padding: '24px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-light)' }}>
      {message}
    </div>
  );
}
