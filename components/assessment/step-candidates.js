'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { TIMEZONES } from '@/lib/constants';
import { Plus, Upload, ChevronDown, ChevronUp, X, Clock, Calendar, MapPin } from 'lucide-react';

const durations = ['2h', '4h', '24h', '3d', '1w'];
const startOptions = [
  { id: 'now', label: 'Now' },
  { id: 'tomorrow', label: 'Tomorrow 9 AM' },
  { id: 'custom', label: 'Pick date/time' },
];

function CandidateForm({ candidate, onUpdate, onRemove, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className="rounded-xl border transition-all duration-200"
      style={{
        backgroundColor: 'var(--cream-card)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Collapsed header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-body-sm" style={{ color: 'var(--brown)' }}>
            {candidate.email || 'New Candidate'}
          </span>
          {candidate.duration && (
            <span className="text-mono-tag" style={{ color: 'var(--brown-soft)' }}>
              {candidate.duration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-6 h-6 rounded flex items-center justify-center bg-transparent border-none cursor-pointer hover-bg-dim"
            style={{ color: 'var(--brown-soft)' }}
          >
            <X size={14} />
          </button>
          {expanded ? <ChevronUp size={16} style={{ color: 'var(--brown-soft)' }} /> : <ChevronDown size={16} style={{ color: 'var(--brown-soft)' }} />}
        </div>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div className="px-4 pb-4 border-t animate-fsu" style={{ borderColor: 'var(--border-light)' }}>
          <div className="pt-4 grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-mono-label block mb-1.5">Email *</label>
              <input
                type="email"
                placeholder="candidate@example.com"
                value={candidate.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-body-sm outline-none font-body focus-border-hover"
                style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              />
            </div>
            <div>
              <label className="text-mono-label block mb-1.5">Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                value={candidate.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-body-sm outline-none font-body focus-border-hover"
                style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
              />
            </div>
          </div>

          {/* Timezone */}
          <div className="mb-4">
            <label className="text-mono-label block mb-1.5">
              <MapPin size={10} className="inline mr-1" />Timezone *
            </label>
            <select
              value={candidate.timezone}
              onChange={(e) => onUpdate({ timezone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-body-sm outline-none font-body cursor-pointer appearance-none"
              style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
            >
              <option value="">Select timezone...</option>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.flag} {tz.label}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="text-mono-label block mb-1.5">
              <Clock size={10} className="inline mr-1" />How long?
            </label>
            <div className="flex gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => onUpdate({ duration: d })}
                  className="px-4 py-1.5 rounded-full border text-body-xs font-semibold transition-all cursor-pointer font-body"
                  style={{
                    backgroundColor: candidate.duration === d ? 'rgba(39,130,91,0.06)' : 'transparent',
                    borderColor: candidate.duration === d ? 'var(--accent-green)' : 'var(--border-default)',
                    color: candidate.duration === d ? 'var(--accent-green)' : 'var(--brown)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Start time */}
          <div className="mb-4">
            <label className="text-mono-label block mb-1.5">
              <Calendar size={10} className="inline mr-1" />When can they start?
            </label>
            <div className="flex gap-2">
              {startOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdate({ startTime: opt.id })}
                  className="px-4 py-1.5 rounded-full border text-body-xs font-semibold transition-all cursor-pointer font-body"
                  style={{
                    backgroundColor: candidate.startTime === opt.id ? 'rgba(39,130,91,0.06)' : 'transparent',
                    borderColor: candidate.startTime === opt.id ? 'var(--accent-green)' : 'var(--border-default)',
                    color: candidate.startTime === opt.id ? 'var(--accent-green)' : 'var(--brown)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated window */}
          {candidate.startTime && candidate.duration && (
            <div
              className="rounded-lg px-3 py-2 text-body-xs"
              style={{ backgroundColor: 'var(--cream-sidebar)', color: 'var(--brown-soft)' }}
            >
              Candidate window: {candidate.startTime === 'now' ? 'Starts immediately' : candidate.startTime === 'tomorrow' ? 'Tomorrow 9:00 AM' : 'Custom start'} &middot; {candidate.duration} to complete
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StepCandidates() {
  const candidates = useAssessmentStore((s) => s.candidates);
  const teamTrial = useAssessmentStore((s) => s.teamTrial);
  const addCandidate = useAssessmentStore((s) => s.addCandidate);
  const removeCandidate = useAssessmentStore((s) => s.removeCandidate);
  const updateCandidate = useAssessmentStore((s) => s.updateCandidate);
  const setTeamTrial = useAssessmentStore((s) => s.setTeamTrial);
  const completeStep = useAssessmentStore((s) => s.completeStep);

  const handleAdd = () => {
    addCandidate({
      email: '',
      name: '',
      timezone: '',
      duration: '24h',
      startTime: 'now',
    });
  };

  const canContinue = candidates.length > 0 && candidates.every((c) => c.email && c.name);

  return (
    <div className="animate-fade-scale">
      <h2 className="text-display-dialog mb-2">Assign candidates to this assessment</h2>

      {/* Top controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-body-sm">
            <input
              type="checkbox"
              checked={teamTrial}
              onChange={(e) => setTeamTrial(e.target.checked)}
              className="accent-[var(--accent-green)]"
            />
            Team Trial
          </label>
          <span className="text-mono-tag" style={{ color: 'var(--brown-soft)' }}>
            {candidates.length} added
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-body-xs">
            <Upload size={12} /> Bulk upload
          </button>
          <button className="btn-primary text-body-xs" onClick={handleAdd}>
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* Candidate cards */}
      <div className="space-y-3 mb-6">
        {candidates.map((cand, i) => (
          <CandidateForm
            key={cand.id}
            candidate={cand}
            onUpdate={(data) => updateCandidate(cand.id, data)}
            onRemove={() => removeCandidate(cand.id)}
            defaultExpanded={i === candidates.length - 1}
          />
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12 mb-6">
          <p className="text-body-xs" style={{ color: 'var(--brown-soft)' }}>
            No candidates yet. Add your first one above.
          </p>
        </div>
      )}

      <button
        className="btn-primary w-full py-3"
        disabled={!canContinue}
        onClick={() => completeStep(6)}
      >
        Submit
      </button>
    </div>
  );
}
