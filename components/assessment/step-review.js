'use client';

import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { RUBRIC_FRAMEWORKS } from '@/lib/constants';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Trash2, Plus, CheckCircle, Loader2 } from 'lucide-react';

const mockRubrics = [
  {
    id: 'deliverable-quality', name: 'Deliverable Quality', description: 'All required artifacts produced in working condition',
    rubrics: [
      { id: 'r1', title: 'Incident classification taxonomy complete', description: 'All store incident types from data classified', weight: 'Essential', score: 9 },
      { id: 'r2', title: 'Handoff sequence fully specified', description: 'Complete sequence between all teams', weight: 'Essential', score: 8 },
      { id: 'r3', title: 'Confidence routing thresholds per category', description: 'Separate thresholds for each system', weight: 'Important', score: 7 },
    ],
    pitfalls: [
      { id: 'p1', title: 'Missing POS-specific safeguards', description: 'No separate handling for payment systems', weight: 'Major', score: -6 },
    ],
  },
  {
    id: 'analytical-rigor', name: 'Analytical Rigor', description: 'Analyses correct, consistent, and well-reasoned',
    rubrics: [
      { id: 'r4', title: 'Data-driven incident categorization', description: 'Used actual ticket data to classify', weight: 'Essential', score: 9 },
      { id: 'r5', title: 'Volume projection methodology', description: 'Scalable projection from pilot to full deployment', weight: 'Important', score: 6 },
    ],
    pitfalls: [],
  },
  {
    id: 'framework-design', name: 'Framework Design', description: 'Operating model comprehensive and configurable',
    rubrics: [
      { id: 'r6', title: 'Conservative and aggressive variants', description: 'Two operating modes provided', weight: 'Important', score: 7 },
      { id: 'r7', title: 'L1 team sustainability analysis', description: 'Assessment of outsourced team capacity', weight: 'Important', score: 5 },
    ],
    pitfalls: [],
  },
  {
    id: 'communication', name: 'Communication', description: 'VP can walk through it, executive-ready',
    rubrics: [
      { id: 'r8', title: 'Executive summary present', description: 'One-page overview for leadership', weight: 'Important', score: 6 },
    ],
    pitfalls: [],
  },
  {
    id: 'ai-collaboration', name: 'AI Collaboration', description: 'Used AI tools effectively and critically',
    rubrics: [
      { id: 'r9', title: 'Appropriate AI tool usage', description: 'Used AI for data analysis, not just text generation', weight: 'Optional', score: 3 },
    ],
    pitfalls: [],
  },
  {
    id: 'prioritization', name: 'Prioritization', description: 'Focused on what matters',
    rubrics: [
      { id: 'r10', title: 'POS outage root cause addressed', description: 'Specifically prevents recurrence', weight: 'Optional', score: 3 },
    ],
    pitfalls: [],
  },
];

const redFlags = [
  { id: 'rf1', title: 'No deliverable produced', description: 'Output not an operating model', score: -327 },
  { id: 'rf2', title: 'Fabricated data', description: 'Invented ticket data or statistics', score: -327 },
];

const weightOptions = ['Essential', 'Important', 'Optional'];

function DimensionRow({ dimension, onUpdateRubric, onDeleteRubric, onAddRubric }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover-bg-cream-card-hover transition-colors"
        style={{ backgroundColor: 'var(--cream-card)' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
            {dimension.name}
          </span>
          <span className="text-mono-tag" style={{ color: 'var(--brown-soft)' }}>
            {dimension.rubrics.length} rubrics
          </span>
        </div>
        {expanded ? <ChevronUp size={16} style={{ color: 'var(--brown-soft)' }} /> : <ChevronDown size={16} style={{ color: 'var(--brown-soft)' }} />}
      </div>

      {expanded && (
        <div className="border-t animate-fsu" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-4 py-2 text-body-xs" style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cream-sidebar)' }}>
            {dimension.description}
          </div>
          {dimension.rubrics.map((rubric) => (
            <div key={rubric.id} className="flex items-center gap-3 px-4 py-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex-1">
                <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{rubric.title}</div>
                <div className="text-body-xs">{rubric.description}</div>
              </div>
              <select
                value={rubric.weight}
                onChange={(e) => onUpdateRubric(rubric.id, { weight: e.target.value })}
                className="px-2 py-1 rounded border text-mono-tag outline-none font-mono cursor-pointer"
                style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--cream)', color: 'var(--brown)' }}
              >
                {weightOptions.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              <button
                onClick={() => onDeleteRubric(rubric.id)}
                className="w-7 h-7 rounded flex items-center justify-center bg-transparent border-none cursor-pointer hover-bg-dim"
                style={{ color: 'var(--brown-soft)' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {dimension.pitfalls.length > 0 && (
            <>
              <div className="px-4 py-2 text-mono-label" style={{ backgroundColor: 'var(--cream-sidebar)' }}>
                Pitfalls & Red Flags
              </div>
              {dimension.pitfalls.map((pitfall) => (
                <div key={pitfall.id} className="flex items-center gap-3 px-4 py-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="text-body-xs" style={{ color: 'var(--red)' }}>⚠</span>
                  <div className="flex-1">
                    <div className="text-body-sm" style={{ color: 'var(--brown)' }}>{pitfall.title}</div>
                    <div className="text-body-xs">{pitfall.description}</div>
                  </div>
                  <span className="text-mono-data" style={{ color: 'var(--red)' }}>{pitfall.score}</span>
                </div>
              ))}
            </>
          )}
          <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <button
              onClick={onAddRubric}
              className="flex items-center gap-1.5 text-body-xs font-semibold bg-transparent border-none cursor-pointer font-body"
              style={{ color: 'var(--gold)' }}
            >
              <Plus size={12} /> Add rubric
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepReview() {
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [dimensions, setDimensions] = useState([]);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const candidates = useAssessmentStore((s) => s.candidates);
  const task = useAssessmentStore((s) => s.task);
  const role = useAssessmentStore((s) => s.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDimensions(mockRubrics);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateRubric = (rubricId, data) => {
    setDimensions((dims) =>
      dims.map((dim) => ({
        ...dim,
        rubrics: dim.rubrics.map((r) => r.id === rubricId ? { ...r, ...data } : r),
      }))
    );
  };

  const handleDeleteRubric = (rubricId) => {
    setDimensions((dims) =>
      dims.map((dim) => ({
        ...dim,
        rubrics: dim.rubrics.filter((r) => r.id !== rubricId),
      }))
    );
  };

  const handleAddRubric = (dimId) => {
    setDimensions((dims) =>
      dims.map((dim) => {
        if (dim.id !== dimId) return dim;
        return {
          ...dim,
          rubrics: [...dim.rubrics, {
            id: 'custom-' + Date.now(),
            title: 'Custom rubric',
            description: 'Edit this rubric description',
            weight: 'Optional',
            score: 3,
          }],
        };
      })
    );
  };

  const handleSend = () => {
    setSent(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fi">
        <Loader2 size={32} className="animate-spin mb-4" style={{ color: 'var(--gold)' }} />
        <p className="text-body-sm" style={{ color: 'var(--brown)' }}>
          Building assessment environment and generating evaluation rubrics...
        </p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="text-center py-12 animate-fade-scale">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--accent-green)' }} />
        <h2 className="text-display-dialog mb-2">Assessment Sent</h2>
        <p className="text-body-sm mb-2" style={{ color: 'var(--brown)' }}>
          {task.name || 'Assessment'} for {role.title || 'Role'}
        </p>
        <p className="text-body-xs mb-8">
          {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} will receive their invitation.
        </p>

        <div className="max-w-md mx-auto text-left rounded-xl border p-5 mb-8" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
          <h3 className="text-display-section mb-4">What happens next</h3>
          <div className="space-y-3">
            {[
              { icon: '📧', title: 'Candidates notified', desc: 'Email invitations sent within 5 minutes.' },
              { icon: '⏱', title: 'Assessment window opens', desc: 'Timer starts based on scheduled start time.' },
              { icon: '📊', title: 'Results appear', desc: 'Scores populate as candidates submit.' },
              { icon: '🔔', title: 'Completion notification', desc: 'You\'ll receive an email when all candidates finish.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-[16px]">{item.icon}</span>
                <div>
                  <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{item.title}</div>
                  <div className="text-body-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="btn-secondary no-underline">Go to Dashboard</Link>
          <button className="btn-primary" onClick={() => { setSent(false); setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
            Create Another Assessment
          </button>
        </div>
      </div>
    );
  }

  const totalRubrics = dimensions.reduce((sum, d) => sum + d.rubrics.length, 0);

  return (
    <div className="animate-fade-scale">
      <h2 className="text-display-dialog mb-4">Evaluation Rubrics</h2>

      {/* Summary */}
      <div className="rounded-xl border p-4 mb-4" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-mono-display" style={{ color: 'var(--brown)' }}>{dimensions.length}</div>
            <div className="text-mono-label">Dimensions</div>
          </div>
          <div>
            <div className="text-mono-display" style={{ color: 'var(--brown)' }}>{totalRubrics}</div>
            <div className="text-mono-label">Rubrics</div>
          </div>
          <div>
            <div className="text-mono-display" style={{ color: 'var(--red)' }}>{redFlags.length}</div>
            <div className="text-mono-label">Red Flags</div>
          </div>
        </div>
      </div>

      {/* Scoring system */}
      <div className="rounded-xl border p-4 mb-6" style={{ backgroundColor: 'var(--cream-sidebar)', borderColor: 'var(--border-default)' }}>
        <h4 className="text-mono-label mb-2">Scoring System</h4>
        <div className="grid grid-cols-3 gap-3 text-body-xs">
          <div><span className="font-semibold" style={{ color: 'var(--accent-green)' }}>Essential</span> (8-10): Core requirement</div>
          <div><span className="font-semibold" style={{ color: 'var(--gold)' }}>Important</span> (4-7): Expected feature</div>
          <div><span className="font-semibold" style={{ color: 'var(--brown-soft)' }}>Optional</span> (2-3): Bonus polish</div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3 mb-6">
        {dimensions.map((dim) => (
          <DimensionRow
            key={dim.id}
            dimension={dim}
            onUpdateRubric={handleUpdateRubric}
            onDeleteRubric={handleDeleteRubric}
            onAddRubric={() => handleAddRubric(dim.id)}
          />
        ))}
      </div>

      {/* Red Flags */}
      <div className="rounded-xl border p-4 mb-6" style={{ backgroundColor: 'rgba(192,57,43,0.03)', borderColor: 'rgba(192,57,43,0.2)' }}>
        <h4 className="text-mono-label mb-2" style={{ color: 'var(--red)' }}>Red Flags (Instant Disqualification)</h4>
        {redFlags.map((rf) => (
          <div key={rf.id} className="flex items-center gap-2 py-1.5">
            <span style={{ color: 'var(--red)' }}>⛔</span>
            <span className="text-body-sm" style={{ color: 'var(--brown)' }}>{rf.title}</span>
            <span className="text-mono-data ml-auto" style={{ color: 'var(--red)' }}>{rf.score}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full py-3" onClick={handleSend}>
        Confirm Rubrics & Send to Candidates
      </button>
    </div>
  );
}
