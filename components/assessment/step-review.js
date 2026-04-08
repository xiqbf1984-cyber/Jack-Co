'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import { Loader2, Mail, ArrowRight } from 'lucide-react';

// ─── Shared styles ───

var cardStyle = {
  borderRadius: 12,
  border: '1px solid var(--border-default)',
  background: '#fff',
  padding: '16px 20px',
  marginBottom: 24,
};

var editableStyle = {
  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
  lineHeight: 1.7, margin: 0, outline: 'none', cursor: 'text',
  borderRadius: 6, padding: '4px 2px',
};

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
          color: 'var(--brown)', margin: '0 0 3px 0',
        }}>{title}</h3>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', margin: 0 }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function EditLink({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 3,
      fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--gold)',
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    }}>
      {label || 'Edit'} <ArrowRight size={9} />
    </button>
  );
}

// ─── Success Page ───

function SuccessPage({ task, role, candidateCount, onDashboard, onCreateAnother }) {
  var steps = [
    { icon: '📧', title: 'Candidates notified', desc: 'Email invitations sent within 5 minutes.' },
    { icon: '⏱', title: 'Assessment window opens', desc: "Each candidate's timer starts based on their schedule." },
    { icon: '📊', title: 'Results appear', desc: 'Scores populate as candidates submit.' },
    { icon: '🔔', title: 'Completion notification', desc: 'Email when all candidates have submitted.' },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '30px 0', animation: 'fadeScale .3s ease' }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        backgroundColor: 'rgba(39,130,91,0.12)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <Mail size={28} style={{ color: 'var(--accent-green)' }} />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: 'var(--brown)', marginBottom: 8 }}>
        Assessment Sent
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--brown-muted)', marginBottom: 4 }}>
        {task.name || 'Assessment'}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-light)', marginBottom: 32 }}>
        {candidateCount} candidate{candidateCount !== 1 ? 's' : ''} will receive their invitation.
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
        ── What happens next ──
      </div>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        {steps.map(function (step, i) {
          return (
            <div key={step.title} style={{
              display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 12,
              border: '1px solid var(--border-default)', backgroundColor: '#fff',
              marginBottom: 8, textAlign: 'left', animation: 'fsu .2s ease ' + (i * 0.08) + 's both',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--cream)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13,
              }}>{step.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{step.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-muted)', marginTop: 2, lineHeight: 1.4 }}>{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
        <button onClick={onDashboard} className="btn-primary">Go to Dashboard</button>
        <button onClick={onCreateAnother} className="btn-secondary">Create Another</button>
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function StepReview() {
  var router = useRouter();
  var [loading, setLoading] = useState(true);
  var [sent, setSent] = useState(false);

  var role = useAssessmentStore(function (s) { return s.role; });
  var selectedRole = useAssessmentStore(function (s) { return s.selectedRole; });
  var task = useAssessmentStore(function (s) { return s.task; });
  var context = useAssessmentStore(function (s) { return s.context; });
  var environment = useAssessmentStore(function (s) { return s.environment; });
  var rubrics = useAssessmentStore(function (s) { return s.rubrics; });
  var candidates = useAssessmentStore(function (s) { return s.candidates; });
  var reset = useAssessmentStore(function (s) { return s.reset; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var updateContext = useAssessmentStore(function (s) { return s.updateContext; });
  var updateEnvironment = useAssessmentStore(function (s) { return s.updateEnvironment; });
  var addAssessment = useAppStore(function (s) { return s.addAssessment; });

  var contextRef = useRef(null);
  var envContextRef = useRef(null);
  var envRoleRef = useRef(null);
  var deliverableRefs = useRef([]);

  var dimensions = rubrics.dimensions || [];
  var deliverables = environment.deliverables || [];

  useEffect(function () {
    var timer = setTimeout(function () { setLoading(false); }, 1200);
    return function () { clearTimeout(timer); };
  }, []);

  var handleSend = function () {
    // Save any contentEditable changes
    if (contextRef.current) {
      updateContext({ description: contextRef.current.innerText });
    }
    if (envContextRef.current || envRoleRef.current) {
      var envUpdates = {};
      if (envContextRef.current) envUpdates.contextText = envContextRef.current.innerText;
      if (envRoleRef.current) envUpdates.yourRoleText = envRoleRef.current.innerText;
      var updatedDeliverables = deliverableRefs.current.map(function (ref, i) {
        if (ref) return ref.innerText;
        var d = deliverables[i];
        return typeof d === 'string' ? d : (d && d.text ? d.text : String(d));
      });
      if (updatedDeliverables.length > 0) envUpdates.deliverables = updatedDeliverables;
      updateEnvironment(envUpdates);
    }

    addAssessment({
      name: task.name || 'New Assessment',
      roleId: null,
      roleTitle: role.title,
      status: 'published',
      skill: task.categoryName,
      task: task.name,
      candIds: candidates.map(function (c) { return c.poolId || c.id; }),
      results: [],
    });
    setSent(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 16 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-muted)' }}>Preparing review...</p>
      </div>
    );
  }

  if (sent) {
    return (
      <SuccessPage
        task={task} role={role} candidateCount={candidates.length}
        onDashboard={function () { reset(); router.push('/dashboard'); }}
        onCreateAnother={function () { reset(); }}
      />
    );
  }

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: '0 0 4px 0' }}>
          Review Assessment
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Review everything before sending. You can edit any section inline.
        </p>
      </div>

      {/* ── Role & Task ── */}
      <SectionHeader title="Role & Task" subtitle="Position and assignment" action={<EditLink onClick={function () { goToStep(0); }} label="Change" />} />
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>Role</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 500 }}>
              {selectedRole.name || role.title || '—'}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>Task</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 500 }}>
              {task.name || '—'}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>Category</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 500 }}>
              {task.categoryName || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem ── */}
      <SectionHeader title="Problem" subtitle="Business challenge context" />
      <div style={cardStyle}>
        <p ref={contextRef} contentEditable suppressContentEditableWarning style={editableStyle}>
          {context.description || '—'}
        </p>
      </div>

      {/* ── Environment: Context ── */}
      {environment.contextText && (
        <>
          <SectionHeader title="Context" subtitle="Background scenario for the candidate" />
          <div style={cardStyle}>
            <p ref={envContextRef} contentEditable suppressContentEditableWarning style={editableStyle}>
              {environment.contextText}
            </p>
          </div>
        </>
      )}

      {/* ── Environment: Your Role ── */}
      {environment.yourRoleText && (
        <>
          <SectionHeader title="Your Role" subtitle="What the candidate will be acting as" />
          <div style={cardStyle}>
            <p ref={envRoleRef} contentEditable suppressContentEditableWarning style={editableStyle}>
              {environment.yourRoleText}
            </p>
          </div>
        </>
      )}

      {/* ── Deliverables ── */}
      {deliverables.length > 0 && (
        <>
          <SectionHeader title="Deliverables" subtitle="What the candidate must produce" />
          <div style={cardStyle}>
            {deliverables.map(function (d, i) {
              var text = typeof d === 'string' ? d : d.text || d;
              return (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '8px 0',
                  borderBottom: i < deliverables.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brown-light)', flexShrink: 0, minWidth: 20, paddingTop: 2 }}>
                    {i + 1}.
                  </span>
                  <span
                    ref={function (el) { deliverableRefs.current[i] = el; }}
                    contentEditable suppressContentEditableWarning
                    style={{ ...editableStyle, flex: 1, lineHeight: 1.6 }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Rubrics ── */}
      {dimensions.length > 0 && (
        <>
          <SectionHeader title="Rubrics" subtitle="Evaluation criteria" action={<EditLink onClick={function () { goToStep(4); }} />} />
          <div style={cardStyle}>
            {dimensions.map(function (dim) {
              var count = (dim.criteria || dim.rubrics || []).length;
              return (
                <div key={dim.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border-light)',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{dim.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brown-light)' }}>{count} criteria</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Candidates ── */}
      <SectionHeader title="Candidates" subtitle="Who will receive this assessment" action={<EditLink onClick={function () { goToStep(5); }} />} />
      <div style={cardStyle}>
        {candidates.length > 0 ? candidates.map(function (c) {
          var initials = c.name ? c.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2) : '??';
          return (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                backgroundColor: 'rgba(139,105,20,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600, color: 'var(--gold)',
                flexShrink: 0,
              }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginLeft: 8 }}>{c.email}</span>
              </div>
            </div>
          );
        }) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-light)', padding: '8px 0' }}>No candidates added.</div>
        )}
      </div>

      {/* ── Confirm ── */}
      <button onClick={handleSend} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        Confirm & Send to Candidates
      </button>
    </div>
  );
}
