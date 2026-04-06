'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { GRADE_SCALE, STATUS_MAP } from '@/lib/constants';
import { ChevronRight, Search, MoreHorizontal, ChevronDown, Trash2, Archive, UserPlus, Lock, Users as UsersIcon, Upload } from 'lucide-react';

function getGrade(score) {
  for (var [letter, range] of Object.entries(GRADE_SCALE)) {
    if (score >= range.min && score <= range.max) return { letter, color: range.color };
  }
  return { letter: 'F', color: '#c0392b' };
}

function ToggleSwitch({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      width: 40, height: 22, borderRadius: 11, border: 'none',
      backgroundColor: value ? 'var(--accent-green)' : 'var(--border-default)',
      cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s ease', flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
        position: 'absolute', top: 2, left: value ? 20 : 2, transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

var avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
var tabs = ['Overview', 'Candidates', 'Settings'];

export default function AssessmentDetailPage() {
  var { id } = useParams();
  var assessments = useAppStore(function (s) { return s.assessments; });
  var candidates = useAppStore(function (s) { return s.candidates; });
  var assessment = assessments.find(function (a) { return a.id === id; });
  var [activeTab, setActiveTab] = useState('Overview');
  var [acceptNew, setAcceptNew] = useState(true);
  var [strictDevice, setStrictDevice] = useState(false);
  var [candSearch, setCandSearch] = useState('');
  var [resources, setResources] = useState([]);
  var openModal = useAppStore(function (s) { return s.openAddCandidateModal; });

  if (!assessment) {
    return (
      <div>
        <Link href="/assessment" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          Assessments <ChevronRight size={12} /> <span style={{ color: 'var(--brown)' }}>Not Found</span>
        </Link>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>Assessment not found.</p>
      </div>
    );
  }

  var statusColors = { published: '#27825b', submitted: '#0077B5', pending: '#d4880f', draft: '#c4b896', active: '#27825b', completed: '#27825b' };
  var statusColor = statusColors[assessment.status] || '#c4b896';
  var statusInfo = STATUS_MAP[assessment.status] || STATUS_MAP.draft;
  var assignedCands = (assessment.candIds || []).map(function (cid) { return candidates.find(function (c) { return c.id === cid; }); }).filter(Boolean);
  var invitedCount = assignedCands.length;
  var activeCount = assignedCands.filter(function (c) { return c.status === 'active'; }).length;
  var completedCount = assignedCands.filter(function (c) { return c.status === 'completed'; }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Link href="/assessment" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', textDecoration: 'none' }}>Assessments</Link>
        <ChevronRight size={12} style={{ color: 'var(--brown-light)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 500 }}>{assessment.name}</span>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
        borderRadius: 12, background: 'rgba(0,0,0,0.04)', width: 'fit-content', marginBottom: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)' }}>{statusInfo.label}</span>
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
        {assessment.name}
      </h1>

      {/* Meta */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 20 }}>
        Created {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'recently'}
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-light)', marginBottom: 24 }}>
        {tabs.map(function (tab) {
          var isActive = activeTab === tab;
          return (
            <button key={tab} onClick={function () { setActiveTab(tab); }} style={{
              padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--brown)' : 'var(--brown-soft)',
              borderBottom: isActive ? '2px solid var(--brown)' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}>{tab}</button>
          );
        })}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fsu 0.2s ease' }}>
          {/* Candidate stats */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)', marginBottom: 12 }}>Candidates</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { value: invitedCount, label: 'Invited' },
                { value: activeCount, label: 'Active' },
                { value: completedCount, label: 'Completed' },
                { value: '\u2014', label: 'Avg Duration' },
              ].map(function (stat) {
                return (
                  <div key={stat.label} style={{
                    padding: '16px 18px', borderRadius: 12,
                    border: '1px solid var(--border-default)', background: '#fff',
                  }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: 'var(--brown)', marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Specification */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)', marginBottom: 12 }}>Work Specification</h3>
            <div style={{
              padding: '20px 24px', borderRadius: 12,
              border: '1px solid var(--border-default)', background: '#fff',
            }}>
              <h4 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>
                Welcome to {assessment.name}
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.6, marginBottom: 16 }}>
                This assessment evaluates candidates through a structured work sample.
              </p>

              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>What to do:</div>
              <ol style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
                <li>Open the link or enter the invite code in the desktop app</li>
                <li>Start the session and explore the interface</li>
                <li>The app will capture your screen as you work</li>
                <li>End the session when you're ready</li>
              </ol>

              {/* Role and task info */}
              {(assessment.roleTitle || assessment.task) && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {assessment.roleTitle && <div><span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', display: 'block', marginBottom: 3 }}>Role</span><span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{assessment.roleTitle}</span></div>}
                  {assessment.skill && <div><span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', display: 'block', marginBottom: 3 }}>Skill</span><span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{assessment.skill}</span></div>}
                  {assessment.task && <div><span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', display: 'block', marginBottom: 3 }}>Task</span><span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{assessment.task}</span></div>}
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)' }}>Resources</h3>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6,
                border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)',
                fontSize: 11, color: 'var(--brown-soft)', cursor: 'pointer',
              }}>+ Add<input type="file" multiple onChange={function (e) { setResources(function (prev) { return prev.concat(Array.from(e.target.files || [])); }); e.target.value = ''; }} style={{ display: 'none' }} /></label>
            </div>
            {resources.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                {resources.map(function (f, i) { return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#fff' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)', flex: 1 }}>{f.name}</span>
                    <button onClick={function () { setResources(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); }); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brown-soft)', padding: 2 }}>x</button>
                  </div>
                ); })}
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginTop: 8 }}>No Resources Yet</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)' }}>Max 5 files, 500 MB each</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CANDIDATES TAB ===== */}
      {activeTab === 'Candidates' && (
        <div style={{ animation: 'fsu 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)' }}>
              Candidates ({assignedCands.length})
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <label className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11, gap: 5, cursor: 'pointer' }}>
                <Upload size={12} /> Bulk upload
                <input type="file" accept=".csv,.xlsx" onChange={function () {}} style={{ display: 'none' }} />
              </label>
              <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 11 }} onClick={openModal}>Invite</button>
            </div>
          </div>

          {/* Search + filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
              <input type="text" value={candSearch} onChange={function (e) { setCandSearch(e.target.value); }} placeholder="Search candidates..."
                style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, borderRadius: 7, border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', borderRadius: 7, border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', cursor: 'pointer' }}>
              Status <ChevronDown size={10} />
            </button>
          </div>

          {/* Candidates table */}
          {assignedCands.length > 0 ? (
            <div style={{ borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 40px', padding: '0 16px', height: 38, alignItems: 'center', borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--cream)' }}>
                {['Candidate', 'Status', 'Timezone', 'Schedule', 'Last Active', ''].map(function (h, i) {
                  return <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: 'var(--brown-soft)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {h}{h && <span style={{ fontSize: 9, opacity: 0.5 }}>&#8597;</span>}
                  </span>;
                })}
              </div>
              {assignedCands.map(function (cand, i) {
                var si = STATUS_MAP[cand.status] || STATUS_MAP.idle;
                var sc = 'var(--' + si.color + ')';
                var initials = cand.avatar || cand.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
                return (
                  <div key={cand.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 40px', padding: '0 16px', height: 54, alignItems: 'center', borderBottom: i < assignedCands.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600, color: '#fff' }}>{initials}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>{cand.name}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)' }}>{cand.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.04)', width: 'fit-content' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: sc }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown)' }}>{si.label}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)' }}>{cand.tz}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>\u2014</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>{cand.lastActive || '\u2014'}</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brown-light)' }}><MoreHorizontal size={14} /></button>
                  </div>
                );
              })}
              <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--cream)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>Viewing <strong style={{ color: 'var(--brown)' }}>{assignedCands.length}</strong> rows</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>No candidates assigned yet.</p>
              <button className="btn-primary" style={{ marginTop: 12, padding: '7px 16px', fontSize: 11 }} onClick={openModal}>Invite Candidates</button>
            </div>
          )}
        </div>
      )}

      {/* ===== SETTINGS TAB ===== */}
      {activeTab === 'Settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fsu 0.2s ease' }}>
          {/* Assessment Settings */}
          <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>Assessment Settings</h3>
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={16} style={{ color: 'var(--brown-soft)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Accept new candidates</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 1 }}>Candidates can join via invite link</div>
                </div>
              </div>
              <ToggleSwitch value={acceptNew} onChange={setAcceptNew} />
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={16} style={{ color: 'var(--brown-soft)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Strict device binding</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 1 }}>Candidates can switch devices during the session</div>
                </div>
              </div>
              <ToggleSwitch value={strictDevice} onChange={setStrictDevice} />
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Archive size={16} style={{ color: 'var(--brown-soft)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Archive assessment</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 1 }}>Hide from active list. Restorable anytime.</div>
                </div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border-default)',
                background: '#fff', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)',
                cursor: 'pointer',
              }}>Archive</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ borderRadius: 12, border: '1px solid rgba(192,57,43,0.2)', background: '#fff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 12 }}>Danger Zone</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(192,57,43,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} style={{ color: 'var(--red)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>Delete assessment</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 1 }}>Permanently removes all data. Cannot be undone.</div>
                  </div>
                </div>
                <button style={{
                  padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(192,57,43,0.3)',
                  background: 'rgba(192,57,43,0.04)', fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'var(--red)', cursor: 'pointer', fontWeight: 500,
                }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
