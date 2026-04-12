'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Check, X, Plus, AlertTriangle } from 'lucide-react';

/* ── Status badge ── */
function StatusDot({ status }) {
  var colors = {
    confirmed: 'var(--accent-green)',
    assumed: 'var(--gold)',
    pending: 'var(--brown-light)',
    risk_accepted: 'var(--orange)',
  };
  var labels = {
    confirmed: 'Confirmed',
    assumed: 'Assumed',
    pending: 'Pending',
    risk_accepted: 'Risk accepted',
  };
  var c = colors[status] || colors.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-body)', fontSize: 9,
      color: c, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c }} />
      {labels[status] || status}
    </span>
  );
}

/* ── Collapsible section ── */
function Section({ title, status, defaultOpen, children, count }) {
  var [open, setOpen] = useState(defaultOpen !== false);
  var Icon = open ? ChevronDown : ChevronRight;
  return (
    <div style={{ marginBottom: 2 }}>
      <button
        type="button"
        onClick={function () { setOpen(!open); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          padding: '8px 0', border: 'none', background: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <Icon size={12} style={{ color: 'var(--brown-soft)', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
          color: 'var(--brown)', flex: 1, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>{title}</span>
        {count > 0 && (
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 9,
            color: 'var(--brown-light)', padding: '1px 6px',
            borderRadius: 8, backgroundColor: 'var(--cream)',
          }}>{count}</span>
        )}
        {status && <StatusDot status={status} />}
      </button>
      {open && (
        <div style={{ padding: '0 0 10px 18px', animation: 'fsu 0.15s ease both' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Inline editable field ── */
function Field({ label, value, onSave, status }) {
  var [editing, setEditing] = useState(false);
  var [draft, setDraft] = useState(value || '');

  function save() {
    setEditing(false);
    if (onSave && draft !== value) onSave(draft);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: '1px solid var(--border-light)',
    }}>
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: 11,
        color: 'var(--brown-soft)', flexShrink: 0, width: 90,
      }}>{label}</span>
      {editing ? (
        <div style={{ flex: 1, display: 'flex', gap: 4, alignItems: 'center' }}>
          <input
            autoFocus value={draft}
            onChange={function (e) { setDraft(e.target.value); }}
            onBlur={save}
            onKeyDown={function (e) {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') { setDraft(value || ''); setEditing(false); }
            }}
            style={{
              flex: 1, border: 'none', outline: 'none', padding: '2px 0',
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
              backgroundColor: 'transparent',
              borderBottom: '1.5px solid var(--gold)',
            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            onClick={function () { if (onSave) { setDraft(value || ''); setEditing(true); } }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 12,
              color: value ? 'var(--brown)' : 'var(--brown-light)',
              cursor: onSave ? 'pointer' : 'default',
              flex: 1,
            }}
          >{value || 'Not set'}</span>
          {status && <StatusDot status={status} />}
        </div>
      )}
    </div>
  );
}

/* ── Editable chip list ── */
function ChipList({ items, onAdd, onRemove }) {
  var [adding, setAdding] = useState(false);
  var [draft, setDraft] = useState('');

  function handleAdd() {
    if (draft.trim() && onAdd) { onAdd(draft.trim()); setDraft(''); setAdding(false); }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
      {(items || []).map(function (item, i) {
        return (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px 3px 10px', borderRadius: 14,
            backgroundColor: 'rgba(139,105,20,0.05)',
            border: '1px solid var(--border-light)',
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)',
          }}>
            {item}
            {onRemove && (
              <button type="button" onClick={function () { onRemove(i); }}
                style={{
                  border: 'none', background: 'none', padding: 0,
                  cursor: 'pointer', color: 'var(--brown-light)',
                  display: 'flex', lineHeight: 1,
                }}
              ><X size={10} /></button>
            )}
          </span>
        );
      })}
      {adding ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            autoFocus value={draft}
            onChange={function (e) { setDraft(e.target.value); }}
            onBlur={function () { if (!draft.trim()) setAdding(false); }}
            onKeyDown={function (e) {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') { setDraft(''); setAdding(false); }
            }}
            placeholder="Add..."
            style={{
              width: 80, padding: '2px 6px', borderRadius: 6,
              border: '1px solid var(--gold)', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: 11,
              color: 'var(--brown)', backgroundColor: '#fff',
            }}
          />
        </div>
      ) : onAdd && (
        <button type="button" onClick={function () { setAdding(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 2,
            padding: '3px 8px', borderRadius: 14,
            border: '1px dashed var(--border-default)',
            background: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 10,
            color: 'var(--brown-light)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--brown)'; }}
          onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--brown-light)'; }}
        ><Plus size={10} /> Add</button>
      )}
    </div>
  );
}

/* ── AI Impact card ── */
function ImpactTag({ level }) {
  var config = {
    low: { bg: 'rgba(39,130,91,0.08)', color: 'var(--accent-green)', label: 'Low displacement' },
    medium: { bg: 'rgba(212,136,15,0.08)', color: 'var(--orange)', label: 'Medium displacement' },
    high: { bg: 'rgba(192,57,43,0.08)', color: 'var(--red)', label: 'High displacement' },
  };
  var c = config[level] || config.low;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 14,
      backgroundColor: c.bg, fontFamily: 'var(--font-body)',
      fontSize: 10, fontWeight: 500, color: c.color,
    }}>
      <AlertTriangle size={10} />
      {c.label}
    </span>
  );
}

/* ── Main Component ── */

export default function HiringBriefView({ hiringBrief, onChange }) {
  if (!hiringBrief) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: 40,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--brown-soft)', marginBottom: 6,
          }}>Building your hiring brief...</p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--brown-light)',
          }}>Data populates as you chat with Neo</p>
        </div>
      </div>
    );
  }

  var skills = hiringBrief.skills || [];
  var responsibilities = hiringBrief.responsibilities || [];
  var editable = !!onChange;

  function fieldSave(key) {
    return editable ? function (val) { onChange(key, val); } : null;
  }

  return (
    <div style={{
      padding: '16px 20px 32px',
      overflowY: 'auto', height: '100%',
    }}>
      {/* Matched Role — top banner */}
      {hiringBrief.matchedRoleName && hiringBrief.matchScore > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 8,
          backgroundColor: 'rgba(39,130,91,0.04)',
          border: '1px solid rgba(39,130,91,0.1)',
          marginBottom: 14,
        }}>
          <Check size={12} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--accent-green)',
          }}>Matched: {hiringBrief.matchedRoleName}</span>
        </div>
      )}

      {/* Role Identity */}
      <Section title="Role Identity" defaultOpen={true}>
        <Field label="Title" value={hiringBrief.title} onSave={fieldSave('title')} status="confirmed" />
        <Field label="Level" value={hiringBrief.experience} onSave={fieldSave('experience')} status={hiringBrief.experience ? 'confirmed' : 'pending'} />
        <Field label="Department" value={hiringBrief.department} onSave={fieldSave('department')} status={hiringBrief.department ? 'assumed' : 'pending'} />
        <Field label="Reports to" value={hiringBrief.reportsTo} onSave={fieldSave('reportsTo')} status="pending" />
        <Field label="Type" value="Full-time" status="assumed" />
      </Section>

      {/* Location & Compensation */}
      <Section title="Location & Compensation" defaultOpen={true}>
        <Field label="Location" value={hiringBrief.location} onSave={fieldSave('location')} status={hiringBrief.location ? 'confirmed' : 'pending'} />
        <Field label="Work mode" value={hiringBrief.workMode} onSave={fieldSave('workMode')} status={hiringBrief.workMode ? 'confirmed' : 'pending'} />
        <Field label="Comp range" value={hiringBrief.salary} onSave={fieldSave('salary')} status={hiringBrief.salary ? 'confirmed' : 'pending'} />
      </Section>

      {/* Candidate Profile */}
      <Section title="Must-Haves" count={skills.length} defaultOpen={true}>
        <ChipList items={skills} onAdd={editable ? function (s) { onChange('addSkill', s); } : null} onRemove={editable ? function (i) { onChange('removeSkill', i); } : null} />
      </Section>

      <Section title="Nice-to-Haves" count={hiringBrief.niceToHaves?.length || 0} defaultOpen={false}>
        <ChipList items={hiringBrief.niceToHaves || []} onAdd={editable ? function (s) { onChange('addNiceToHave', s); } : null} onRemove={editable ? function (i) { onChange('removeNiceToHave', i); } : null} />
      </Section>

      <Section title="Anti-Patterns" count={hiringBrief.antiPatterns?.length || 0} defaultOpen={false}>
        {(hiringBrief.antiPatterns || []).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {hiringBrief.antiPatterns.map(function (ap, i) {
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 0',
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'var(--red)',
                }}>
                  <X size={10} style={{ flexShrink: 0 }} />
                  {ap}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>
            None identified yet
          </p>
        )}
      </Section>

      {/* 90-Day Outcomes */}
      <Section title="90-Day Success" count={hiringBrief.outcomes?.length || 0} defaultOpen={false}>
        {(hiringBrief.outcomes || []).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {hiringBrief.outcomes.map(function (o, i) {
              return (
                <div key={i} style={{
                  padding: '6px 0',
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'var(--brown)', borderBottom: '1px solid var(--border-light)',
                }}>{o}</div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>
            Not defined yet
          </p>
        )}
      </Section>

      {/* AI Impact Assessment */}
      <Section title="AI Impact" defaultOpen={false}>
        {hiringBrief.aiDisplacementRisk ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ImpactTag level={hiringBrief.aiDisplacementRisk} />
            {hiringBrief.aiNarrative && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 12,
                color: 'var(--brown-soft)', lineHeight: 1.5, margin: 0,
              }}>{hiringBrief.aiNarrative}</p>
            )}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>
            Assessment runs after P0 fields are complete
          </p>
        )}
      </Section>

      {/* Key Responsibilities */}
      {responsibilities.length > 0 && (
        <Section title="Responsibilities" count={responsibilities.length} defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {responsibilities.map(function (r, i) {
              var clean = r.replace(/^(will|should|responsible for)\s+/i, '').trim();
              clean = clean.charAt(0).toUpperCase() + clean.slice(1);
              return (
                <div key={i} style={{
                  padding: '5px 0', fontFamily: 'var(--font-body)',
                  fontSize: 12, color: 'var(--brown)',
                  borderBottom: '1px solid var(--border-light)',
                }}>{clean}</div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Company */}
      {(hiringBrief.companyName || hiringBrief.companyIndustry) && (
        <Section title="Company" defaultOpen={false}>
          <Field label="Name" value={hiringBrief.companyName} onSave={fieldSave('companyName')} />
          <Field label="Industry" value={hiringBrief.companyIndustry} onSave={fieldSave('companyIndustry')} />
        </Section>
      )}

      {/* Transferability note */}
      <div style={{
        marginTop: 16, padding: '8px 12px', borderRadius: 8,
        backgroundColor: 'var(--cream)',
        fontFamily: 'var(--font-body)', fontSize: 10,
        color: 'var(--brown-light)', lineHeight: 1.4,
      }}>
        This brief is a reusable knowledge asset. It can be shared across teams, used for candidate matching, and updated as the role evolves.
      </div>
    </div>
  );
}
