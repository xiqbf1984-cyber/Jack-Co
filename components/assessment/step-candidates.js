'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { useAppStore } from '@/stores/app-store';
import { TIMEZONES } from '@/lib/constants';
import { Plus, Upload, Search, ChevronDown, ChevronUp, X, Clock, Calendar, MapPin, Send, Mail } from 'lucide-react';

const durations = ['2h', '4h', '24h', '3d', '1w'];
const startOptions = [
  { id: 'now', label: 'Now' },
  { id: 'tomorrow', label: 'Tomorrow 9 AM' },
  { id: 'custom', label: 'Pick date/time' },
];

function CandidateDetailCard({ candidate, onUpdate, onRemove, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getWindow = () => {
    if (!candidate.startTime || !candidate.duration) return null;
    const now = new Date();
    let start = new Date();
    if (candidate.startTime === 'tomorrow') {
      start.setDate(start.getDate() + 1);
      start.setHours(9, 0, 0, 0);
    }
    const durMap = { '2h': 2, '4h': 4, '24h': 24, '3d': 72, '1w': 168 };
    const hours = durMap[candidate.duration] || 24;
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${fmt(start)} → ${fmt(end)}`;
  };

  return (
    <div style={{
      padding: expanded ? '16px 18px' : '12px 14px',
      borderRadius: 12,
      border: '1px solid var(--border-default)',
      backgroundColor: 'var(--cream-card)',
      marginBottom: 8,
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 8,
        }}
      >
        <Mail size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown)',
          flex: 1,
        }}>
          {candidate.name || candidate.email || 'New Candidate'}
        </span>
        {candidate.duration && !expanded && (
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: 'var(--brown-soft)',
          }}>
            {candidate.duration}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        >
          <X size={12} style={{ color: 'var(--brown-light)' }} />
        </button>
        {expanded
          ? <ChevronUp size={14} style={{ color: 'var(--brown-soft)' }} />
          : <ChevronDown size={14} style={{ color: 'var(--brown-soft)' }} />
        }
      </div>

      {/* Expanded form */}
      {expanded && (
        <div style={{ marginTop: 14, animation: 'fsu .15s ease' }}>
          {/* Email + Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown)',
                display: 'block',
                marginBottom: 6,
              }}>
                Email <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="candidate@example.com"
                value={candidate.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  backgroundColor: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown)',
                display: 'block',
                marginBottom: 6,
              }}>
                Name <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={candidate.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  backgroundColor: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Timezone */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown)',
              display: 'block',
              marginBottom: 6,
            }}>
              Timezone <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <select
              value={candidate.timezone}
              onChange={(e) => onUpdate({ timezone: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-default)',
                backgroundColor: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--brown)',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select timezone...</option>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.flag} {tz.label}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
            }}>
              <Clock size={10} /> How long?
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => onUpdate({ duration: d })}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 10,
                    border: `1.5px solid ${candidate.duration === d ? 'var(--gold)' : 'var(--border-default)'}`,
                    backgroundColor: candidate.duration === d ? 'var(--gold)' : '#fff',
                    color: candidate.duration === d ? '#fff' : 'var(--brown-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Start time */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
            }}>
              <Calendar size={10} /> When can they start?
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {startOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdate({ startTime: opt.id })}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    textAlign: 'center',
                    border: `1.5px solid ${candidate.startTime === opt.id ? 'var(--gold)' : 'var(--border-default)'}`,
                    backgroundColor: candidate.startTime === opt.id ? 'var(--gold)' : '#fff',
                    color: candidate.startTime === opt.id ? '#fff' : 'var(--brown-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time window display */}
          {candidate.startTime && candidate.duration && (
            <div style={{
              backgroundColor: 'var(--cream-row-even)',
              borderRadius: 10,
              padding: '12px 14px',
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <MapPin size={12} style={{ color: 'var(--brown-light)' }} />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: 'var(--brown)',
                fontWeight: 700,
              }}>
                {getWindow()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StepCandidates() {
  const wizardCandidates = useAssessmentStore((s) => s.candidates);
  const teamTrial = useAssessmentStore((s) => s.teamTrial);
  const addCandidate = useAssessmentStore((s) => s.addCandidate);
  const removeCandidate = useAssessmentStore((s) => s.removeCandidate);
  const updateCandidate = useAssessmentStore((s) => s.updateCandidate);
  const setTeamTrial = useAssessmentStore((s) => s.setTeamTrial);
  const completeStep = useAssessmentStore((s) => s.completeStep);

  const poolCandidates = useAppStore((s) => s.candidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoolIds, setSelectedPoolIds] = useState([]);

  const togglePoolCandidate = (poolCand) => {
    if (selectedPoolIds.includes(poolCand.id)) {
      setSelectedPoolIds((prev) => prev.filter((id) => id !== poolCand.id));
      // Remove from wizard
      const existing = wizardCandidates.find((c) => c.poolId === poolCand.id);
      if (existing) removeCandidate(existing.id);
    } else {
      setSelectedPoolIds((prev) => [...prev, poolCand.id]);
      addCandidate({
        poolId: poolCand.id,
        email: poolCand.email,
        name: poolCand.name,
        timezone: '',
        duration: '24h',
        startTime: 'now',
        isExisting: true,
      });
    }
  };

  const handleAddNew = () => {
    addCandidate({
      email: '',
      name: '',
      timezone: '',
      duration: '24h',
      startTime: 'now',
      isExisting: false,
    });
  };

  const filteredPool = poolCandidates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const canContinue = wizardCandidates.length > 0 && wizardCandidates.every((c) => c.email && c.name);

  return (
    <div>
      {/* AI bubble */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 14,
        backgroundColor: 'rgba(139,105,20,0.04)',
        border: '1px solid var(--border-light)',
        marginBottom: 20,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Assign candidates to this assessment. Add new ones or select from your existing pool.
        </p>
      </div>

      {/* Team Trial toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: 'var(--cream-row-even)',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 16,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown)',
          }}>
            Team Trial
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--brown-muted)',
            marginTop: 3,
          }}>
            Candidates will work in teams and receive a contribution score.
          </div>
        </div>
        <button
          onClick={() => setTeamTrial(!teamTrial)}
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            border: 'none',
            backgroundColor: teamTrial ? 'var(--accent-green)' : 'var(--border-default)',
            cursor: 'pointer',
            position: 'relative',
            flexShrink: 0,
            transition: 'background-color 0.2s ease',
          }}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#fff',
            position: 'absolute',
            top: 2,
            left: teamTrial ? 18 : 2,
            transition: 'left 0.2s ease',
          }} />
        </button>
      </div>

      {/* Search + action bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--brown-soft)',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            style={{
              width: '100%',
              padding: '9px 10px 9px 30px',
              borderRadius: 10,
              border: '1px solid var(--border-default)',
              backgroundColor: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button className="btn-secondary" style={{ fontSize: 11, padding: '8px 12px' }}>
          <Upload size={12} /> Bulk upload
        </button>
        <button className="btn-primary" style={{ fontSize: 11, padding: '8px 12px' }} onClick={handleAddNew}>
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Existing candidate pool */}
      {filteredPool.length > 0 && (
        <div style={{
          maxHeight: 240,
          overflowY: 'auto',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          backgroundColor: '#fff',
          marginBottom: 14,
        }}>
          {filteredPool.map((c, i) => {
            const isSelected = selectedPoolIds.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => togglePoolCandidate(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderBottom: i < filteredPool.length - 1 ? '1px solid var(--border-light)' : 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(39,130,91,0.04)' : 'transparent',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `2px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-default)'}`,
                  backgroundColor: isSelected ? 'var(--accent-green)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, rgba(139,105,20,0.13), rgba(196,163,50,0.13))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--gold)',
                  }}>
                    {c.avatar || (c.name ? c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?')}
                  </span>
                </div>

                {/* Name + email */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  flex: 1,
                }}>
                  {c.name}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: 'var(--brown-light)',
                }}>
                  {c.email.length > 20 ? c.email.slice(0, 18) + '...' : c.email}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate count */}
      {wizardCandidates.length > 0 && (
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: 'var(--accent-green)',
          marginBottom: 12,
        }}>
          {wizardCandidates.length} candidate{wizardCandidates.length !== 1 ? 's' : ''} assigned
        </div>
      )}

      {/* Selected candidate detail cards */}
      <div style={{ marginBottom: 16 }}>
        {wizardCandidates.map((cand, i) => (
          <CandidateDetailCard
            key={cand.id}
            candidate={cand}
            onUpdate={(data) => updateCandidate(cand.id, data)}
            onRemove={() => {
              removeCandidate(cand.id);
              if (cand.poolId) setSelectedPoolIds((prev) => prev.filter((id) => id !== cand.poolId));
            }}
            defaultExpanded={i === wizardCandidates.length - 1}
          />
        ))}
      </div>

      {wizardCandidates.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '24px 0',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--brown-soft)',
        }}>
          No candidates yet. Select from the pool above or click "+ Add".
        </div>
      )}

      {/* Submit */}
      <button
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', opacity: canContinue ? 1 : 0.5 }}
        disabled={!canContinue}
        onClick={() => completeStep(6)}
      >
        <Send size={12} />
        Submit
      </button>
    </div>
  );
}
