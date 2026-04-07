'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Plus, Trash2, Search } from 'lucide-react';

var MOCK_RUBRICS = [
  {
    id: 'deliverable-quality', name: 'Deliverable Quality',
    description: 'All required artifacts produced in working condition',
    criteria: [
      { id: 'r1', title: 'Incident classification taxonomy complete', description: 'All store incident types from data classified', weight: 'Essential' },
      { id: 'r2', title: 'Handoff sequence fully specified', description: 'Complete sequence between all teams', weight: 'Essential' },
      { id: 'r3', title: 'Confidence routing thresholds per category', description: 'Separate thresholds for each system', weight: 'Important' },
    ],
  },
  {
    id: 'analytical-rigor', name: 'Analytical Rigor',
    description: 'Analyses correct, consistent, and well-reasoned',
    criteria: [
      { id: 'r4', title: 'Data-driven incident categorization', description: 'Used actual ticket data to classify', weight: 'Essential' },
      { id: 'r5', title: 'Volume projection methodology', description: 'Scalable projection from pilot to full deployment', weight: 'Important' },
    ],
  },
  {
    id: 'communication', name: 'Communication',
    description: 'VP can walk through it, executive-ready',
    criteria: [
      { id: 'r6', title: 'Executive summary present', description: 'One-page overview for leadership', weight: 'Important' },
    ],
  },
  {
    id: 'ai-collaboration', name: 'AI Collaboration',
    description: 'Used AI tools effectively and critically',
    criteria: [
      { id: 'r7', title: 'Appropriate AI tool usage', description: 'Used AI for data analysis, not just text generation', weight: 'Optional' },
    ],
  },
];

var WEIGHT_OPTIONS = ['Essential', 'Important', 'Optional'];

var weightColors = {
  Essential: 'var(--accent-green)',
  Important: 'var(--gold)',
  Optional: 'var(--brown-light)',
};

var cardStyle = {
  borderRadius: 12,
  border: '1px solid var(--border-default)',
  background: '#fff',
  padding: '16px 20px',
  marginBottom: 24,
};

export default function StepRubrics() {
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var goToStep = useAssessmentStore(function (s) { return s.goToStep; });
  var updateRubrics = useAssessmentStore(function (s) { return s.updateRubrics; });
  var [dimensions, setDimensions] = useState(MOCK_RUBRICS);
  var [search, setSearch] = useState('');

  function handleUpdateCriterion(dimId, critId, data) {
    setDimensions(function (dims) {
      return dims.map(function (dim) {
        if (dim.id !== dimId) return dim;
        return {
          ...dim,
          criteria: dim.criteria.map(function (c) {
            return c.id === critId ? { ...c, ...data } : c;
          }),
        };
      });
    });
  }

  function handleDeleteCriterion(dimId, critId) {
    setDimensions(function (dims) {
      return dims.map(function (dim) {
        if (dim.id !== dimId) return dim;
        return { ...dim, criteria: dim.criteria.filter(function (c) { return c.id !== critId; }) };
      });
    });
  }

  function handleAddCriterion(dimId) {
    setDimensions(function (dims) {
      return dims.map(function (dim) {
        if (dim.id !== dimId) return dim;
        return {
          ...dim,
          criteria: dim.criteria.concat([{
            id: 'custom-' + Date.now(),
            title: 'New criterion',
            description: 'Describe what to evaluate',
            weight: 'Important',
          }]),
        };
      });
    });
  }

  function handleContinue() {
    updateRubrics({ dimensions: dimensions });
    completeStep(4);
    goToStep(5);
  }

  var q = search.toLowerCase();

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Evaluation Rubrics
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Define how candidates will be scored on this assessment
        </p>
      </div>

      {/* Dimensions */}
      {dimensions.map(function (dim) {
        var filteredCriteria = q
          ? dim.criteria.filter(function (c) { return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q); })
          : dim.criteria;

        if (q && filteredCriteria.length === 0) return null;

        return (
          <div key={dim.id} style={{ marginBottom: 24 }}>
            {/* Section header — above card */}
            <div style={{ marginBottom: 10 }}>
              <h4 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)', margin: '0 0 3px 0' }}>
                {dim.name}
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', margin: 0 }}>
                {dim.description}
              </p>
            </div>

            {/* Card — editable table */}
            <div style={cardStyle}>
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ position: 'relative', width: 220 }}>
                  <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
                  <input
                    type="text" value={search}
                    onChange={function (e) { setSearch(e.target.value); }}
                    placeholder="Search criteria..."
                    style={{
                      width: '100%', paddingLeft: 24, paddingRight: 8, paddingTop: 5, paddingBottom: 5,
                      borderRadius: 6, border: '1px solid var(--border-default)', background: '#fff',
                      fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  onClick={function () { handleAddCriterion(dim.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--brown)',
                    background: 'none', border: '1px solid var(--border-default)', borderRadius: 6,
                    padding: '4px 10px', cursor: 'pointer',
                  }}
                >
                  <Plus size={12} /> Add Criterion
                </button>
              </div>

              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 80px 36px',
                padding: '6px 0', borderBottom: '1px solid var(--border-light)',
                marginBottom: 4,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Title</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Description</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-soft)', textTransform: 'uppercase' }}>Weight</span>
                <span />
              </div>

              {/* Criteria rows */}
              {filteredCriteria.map(function (c) {
                return (
                  <div key={c.id} style={{
                    display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 80px 36px',
                    padding: '8px 0', borderBottom: '1px solid var(--border-light)',
                    alignItems: 'center',
                  }}>
                    <input
                      type="text" defaultValue={c.title}
                      onBlur={function (e) { handleUpdateCriterion(dim.id, c.id, { title: e.target.value }); }}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', fontWeight: 500,
                        border: 'none', outline: 'none', background: 'transparent', padding: '2px 0',
                        width: '100%', boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="text" defaultValue={c.description}
                      onBlur={function (e) { handleUpdateCriterion(dim.id, c.id, { description: e.target.value }); }}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)',
                        border: 'none', outline: 'none', background: 'transparent', padding: '2px 4px',
                        width: '100%', boxSizing: 'border-box',
                      }}
                    />
                    <select
                      value={c.weight}
                      onChange={function (e) { handleUpdateCriterion(dim.id, c.id, { weight: e.target.value }); }}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                        color: weightColors[c.weight] || 'var(--brown-light)',
                        border: '1px solid var(--border-light)', borderRadius: 4,
                        background: 'transparent', padding: '2px 4px', cursor: 'pointer', outline: 'none',
                      }}
                    >
                      {WEIGHT_OPTIONS.map(function (w) { return <option key={w} value={w}>{w}</option>; })}
                    </select>
                    <button
                      onClick={function () { handleDeleteCriterion(dim.id, c.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brown-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Continue */}
      <button onClick={handleContinue} className="btn-primary" style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 24px', fontSize: 13,
      }}>
        Continue to Candidates
      </button>
    </div>
  );
}
