'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X, AlertTriangle, Users, Briefcase, MapPin, Target, Shield, Cpu } from 'lucide-react';

/* ── Module Card ── */
function ModuleCard({ icon, title, subtitle, color, defaultOpen, children }) {
  var [open, setOpen] = useState(defaultOpen !== false);
  var Icon = icon;
  var Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div style={{
      borderRadius: 10, border: '1px solid var(--border-light)',
      backgroundColor: '#fff', overflow: 'hidden',
    }}>
      <button type="button" onClick={function () { setOpen(!open); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '10px 14px', border: 'none', background: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          backgroundColor: color || 'rgba(139,105,20,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={14} style={{ color: 'var(--brown-soft)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)' }}>{title}</div>
          {subtitle && <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)', marginTop: 1 }}>{subtitle}</div>}
        </div>
        <Chevron size={12} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--border-light)', animation: 'fsu 0.12s ease both' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Field row ── */
function FieldRow({ label, value, onEdit }) {
  var [editing, setEditing] = useState(false);
  var [draft, setDraft] = useState(value || '');

  function save() { setEditing(false); if (onEdit && draft !== value) onEdit(draft); }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', width: 80, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
      {editing ? (
        <input autoFocus value={draft}
          onChange={function (e) { setDraft(e.target.value); }}
          onBlur={save}
          onKeyDown={function (e) { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
          style={{ flex: 1, border: 'none', borderBottom: '1.5px solid var(--gold)', outline: 'none', padding: '1px 0', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', backgroundColor: 'transparent' }}
        />
      ) : (
        <span onClick={function () { if (onEdit) { setDraft(value || ''); setEditing(true); } }}
          style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 12, color: value ? 'var(--brown)' : 'var(--brown-light)', cursor: onEdit ? 'pointer' : 'default' }}>
          {value || 'Not set'}
        </span>
      )}
    </div>
  );
}

/* ── Tag list ── */
function Tags({ items, onAdd, onRemove, emptyText }) {
  var [adding, setAdding] = useState(false);
  var [draft, setDraft] = useState('');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center', padding: '8px 0' }}>
      {(items || []).length === 0 && !adding && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>{emptyText || 'None yet'}</span>
      )}
      {(items || []).map(function (item, i) {
        return (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 8px 3px 10px', borderRadius: 12,
            backgroundColor: 'rgba(139,105,20,0.05)', border: '1px solid var(--border-light)',
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)',
          }}>
            {item}
            {onRemove && (
              <button type="button" onClick={function () { onRemove(i); }}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: 'var(--brown-light)', display: 'flex' }}>
                <X size={9} />
              </button>
            )}
          </span>
        );
      })}
      {adding ? (
        <input autoFocus value={draft}
          onChange={function (e) { setDraft(e.target.value); }}
          onBlur={function () { if (!draft.trim()) setAdding(false); }}
          onKeyDown={function (e) {
            if (e.key === 'Enter' && draft.trim()) { onAdd?.(draft.trim()); setDraft(''); setAdding(false); }
            if (e.key === 'Escape') { setDraft(''); setAdding(false); }
          }}
          style={{ width: 80, padding: '2px 6px', borderRadius: 6, border: '1px solid var(--gold)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)' }}
        />
      ) : onAdd && (
        <button type="button" onClick={function () { setAdding(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 2, padding: '3px 8px', borderRadius: 12,
            border: '1px dashed var(--border-default)', background: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-light)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--gold)'; }}
          onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        ><Plus size={9} /> Add</button>
      )}
    </div>
  );
}

/* ── Main ── */
export default function HiringProfileView({ hiringProfile, onChange }) {
  var p = hiringProfile || {};
  var editable = !!onChange;
  function edit(key) { return editable ? function (val) { onChange(key, val); } : null; }

  if (!hiringProfile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <Briefcase size={24} style={{ color: 'var(--brown-light)', marginBottom: 8 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginBottom: 4 }}>Building your hiring profile...</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)' }}>Reusable across roles and teams</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 16px 32px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

      <div style={{
        padding: '6px 10px', borderRadius: 8,
        backgroundColor: 'rgba(90,143,185,0.06)', border: '1px solid rgba(90,143,185,0.12)',
        fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--blue)', lineHeight: 1.4,
      }}>
        Org-level profile — transferable across roles, enriches with each hire
      </div>

      <ModuleCard icon={Briefcase} title="Role Identity" subtitle={p.title || 'Untitled'} defaultOpen={true}>
        <FieldRow label="Title" value={p.title} onEdit={edit('title')} />
        <FieldRow label="Level" value={p.experience} onEdit={edit('experience')} />
        <FieldRow label="Department" value={p.department} onEdit={edit('department')} />
      </ModuleCard>

      <ModuleCard icon={MapPin} title="Location & Comp" subtitle={[p.location, p.workMode, p.salary].filter(Boolean).join(' · ') || 'Not set'}>
        <FieldRow label="Location" value={p.location} onEdit={edit('location')} />
        <FieldRow label="Work mode" value={p.workMode} onEdit={edit('workMode')} />
        <FieldRow label="Comp range" value={p.salary} onEdit={edit('salary')} />
      </ModuleCard>

      <ModuleCard icon={Target} title="Must-Have Skills" subtitle={(p.skills || []).length + ' skills'} defaultOpen={true}>
        <Tags items={p.skills} onAdd={editable ? function (s) { onChange('addSkill', s); } : null} onRemove={editable ? function (i) { onChange('removeSkill', i); } : null} emptyText="No skills specified" />
      </ModuleCard>

      <ModuleCard icon={Plus} title="Nice-to-Haves" subtitle={(p.niceToHaves || []).length + ' items'} defaultOpen={false}>
        <Tags items={p.niceToHaves || []} onAdd={editable ? function (s) { onChange('addNiceToHave', s); } : null} onRemove={editable ? function (i) { onChange('removeNiceToHave', i); } : null} />
      </ModuleCard>

      <ModuleCard icon={Shield} title="Dealbreakers" subtitle={(p.antiPatterns || []).length + ' flags'} defaultOpen={false} color="rgba(192,57,43,0.06)">
        {(p.antiPatterns || []).length > 0 ? (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {p.antiPatterns.map(function (ap, i) {
              return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)' }}><X size={10} /> {ap}</div>;
            })}
          </div>
        ) : <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)', padding: '8px 0' }}>None identified</p>}
      </ModuleCard>

      <ModuleCard icon={Cpu} title="AI vs Human" subtitle="Role displacement analysis" defaultOpen={false} color="rgba(212,136,15,0.06)">
        {p.aiDisplacementRisk ? (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
              padding: '3px 10px', borderRadius: 12,
              backgroundColor: p.aiDisplacementRisk === 'high' ? 'rgba(192,57,43,0.08)' : p.aiDisplacementRisk === 'medium' ? 'rgba(212,136,15,0.08)' : 'rgba(39,130,91,0.08)',
              fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
              color: p.aiDisplacementRisk === 'high' ? 'var(--red)' : p.aiDisplacementRisk === 'medium' ? 'var(--orange)' : 'var(--accent-green)',
            }}><AlertTriangle size={10} /> {p.aiDisplacementRisk} displacement risk</span>
            {p.aiNarrative && <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.5, margin: 0 }}>{p.aiNarrative}</p>}
          </div>
        ) : <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)', padding: '8px 0' }}>Runs after enough data collected</p>}
      </ModuleCard>

      <ModuleCard icon={Users} title="Team Context" defaultOpen={false}>
        <FieldRow label="Company" value={p.companyName} onEdit={edit('companyName')} />
        <FieldRow label="Industry" value={p.companyIndustry} onEdit={edit('companyIndustry')} />
        <FieldRow label="Team size" value={p.teamSize} onEdit={edit('teamSize')} />
      </ModuleCard>
    </div>
  );
}
