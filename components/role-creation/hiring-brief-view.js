'use client';

import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';

function EditableField({ label, value, fieldKey, onSave }) {
  var [editing, setEditing] = useState(false);
  var [draft, setDraft] = useState(value || '');

  function handleSave() {
    setEditing(false);
    if (onSave && draft !== value) onSave(fieldKey, draft);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setDraft(value || ''); setEditing(false); }
  }

  if (editing) {
    return (
      <div style={{
        padding: '10px 14px', borderRadius: 8,
        border: '1.5px solid var(--gold)',
        backgroundColor: 'var(--cream-card)',
        flex: 1, minWidth: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10,
          color: 'var(--brown-soft)', marginBottom: 4,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{label}</div>
        <input
          autoFocus
          value={draft}
          onChange={function (e) { setDraft(e.target.value); }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', border: 'none', outline: 'none', padding: 0,
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
            backgroundColor: 'transparent',
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={function () { if (onSave) { setDraft(value || ''); setEditing(true); } }}
      style={{
        padding: '10px 14px', borderRadius: 8,
        border: '1px solid var(--border-light)',
        backgroundColor: 'var(--cream-card)',
        flex: 1, minWidth: 0,
        cursor: onSave ? 'pointer' : 'default',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={function (e) { if (onSave) e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
      onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
    >
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 10,
        color: 'var(--brown-soft)', marginBottom: 4,
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13,
        color: value ? 'var(--brown)' : 'var(--brown-light)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value || 'Not specified'}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
      color: 'var(--brown-soft)', marginBottom: 10,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </div>
  );
}

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
          }}>
            No hiring brief yet
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--brown-light)',
          }}>
            Continue the conversation to populate the hiring brief
          </p>
        </div>
      </div>
    );
  }

  var skills = hiringBrief.skills || [];
  var responsibilities = hiringBrief.responsibilities || [];

  function handleFieldSave(key, value) {
    if (onChange) onChange(key, value);
  }

  return (
    <div style={{
      padding: '20px 24px 32px',
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Matched Role — at the very top */}
      {hiringBrief.matchedRoleName && hiringBrief.matchScore > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 8,
          backgroundColor: 'rgba(39,130,91,0.05)',
          border: '1px solid rgba(39,130,91,0.12)',
          marginBottom: 20,
        }}>
          <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 10,
              color: 'var(--accent-green)', textTransform: 'uppercase',
              letterSpacing: '0.04em', marginBottom: 2,
            }}>Matched Role</div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--brown)', fontWeight: 500,
            }}>{hiringBrief.matchedRoleName}</div>
          </div>
        </div>
      )}

      {/* Role Overview */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader>Role Overview</SectionHeader>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <EditableField label="Title" value={hiringBrief.title} fieldKey="title" onSave={onChange ? handleFieldSave : null} />
          <EditableField label="Department" value={hiringBrief.department} fieldKey="department" onSave={onChange ? handleFieldSave : null} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <EditableField label="Experience" value={hiringBrief.experience} fieldKey="experience" onSave={onChange ? handleFieldSave : null} />
          <EditableField label="Work Mode" value={hiringBrief.workMode} fieldKey="workMode" onSave={onChange ? handleFieldSave : null} />
        </div>
      </div>

      {/* Location & Compensation */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader>Location & Compensation</SectionHeader>
        <div style={{ display: 'flex', gap: 8 }}>
          <EditableField label="Location" value={hiringBrief.location} fieldKey="location" onSave={onChange ? handleFieldSave : null} />
          <EditableField label="Salary Range" value={hiringBrief.salary} fieldKey="salary" onSave={onChange ? handleFieldSave : null} />
        </div>
      </div>

      {/* Must-Have Skills */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader>Must-Have Skills</SectionHeader>
        {skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map(function (skill, i) {
              return (
                <span key={i} style={{
                  padding: '4px 10px',
                  borderRadius: 14,
                  backgroundColor: 'rgba(139,105,20,0.06)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--brown)',
                }}>
                  {skill}
                </span>
              );
            })}
          </div>
        ) : (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'var(--brown-light)',
          }}>
            No skills specified yet
          </p>
        )}
      </div>

      {/* Key Responsibilities */}
      {responsibilities.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Key Responsibilities</SectionHeader>
          <ul style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--brown)', lineHeight: 1.7,
            paddingLeft: 18, margin: 0,
          }}>
            {responsibilities.map(function (resp, i) {
              var clean = resp.replace(/^(will|should|responsible for)\s+/i, '').trim();
              clean = clean.charAt(0).toUpperCase() + clean.slice(1);
              return <li key={i} style={{ marginBottom: 3 }}>{clean}</li>;
            })}
          </ul>
        </div>
      )}

      {/* Company */}
      {(hiringBrief.companyName || hiringBrief.companyIndustry) && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Company</SectionHeader>
          <div style={{ display: 'flex', gap: 8 }}>
            {hiringBrief.companyName && (
              <EditableField label="Name" value={hiringBrief.companyName} fieldKey="companyName" onSave={onChange ? handleFieldSave : null} />
            )}
            {hiringBrief.companyIndustry && (
              <EditableField label="Industry" value={hiringBrief.companyIndustry} fieldKey="companyIndustry" onSave={onChange ? handleFieldSave : null} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
