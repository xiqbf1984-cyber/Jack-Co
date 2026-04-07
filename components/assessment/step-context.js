'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Upload, X, FileText, Loader2, Check, ArrowRight, Wand2, ChevronDown, ChevronUp } from 'lucide-react';

var MOCK_PREDICTIONS = [
  {
    id: 'pred-1',
    label: 'Most Likely',
    title: 'AI Autonomous Remediation Governance Failure',
    description: 'As your team scales AI-driven device management from pilot to 750+ locations, the current human oversight model will likely fail to prevent autonomous actions in SOX-regulated systems during high-traffic periods.',
    whyFits: 'This candidate would design the human-AI handoff protocols and confidence routing that prevent unsupervised actions in critical systems.',
  },
  {
    id: 'pred-2',
    title: 'Scaling Knowledge Management Across Distributed Teams',
    description: 'As the team grows, institutional knowledge is siloed. New hires take 3-4 months to become productive because documentation is scattered and outdated.',
    whyFits: 'Tests the candidate\'s ability to design systems that capture and distribute organizational knowledge using AI tools.',
  },
  {
    id: 'pred-3',
    title: 'Cross-functional Decision Latency at Scale',
    description: 'Strategic decisions are delayed because data analysis takes too long and stakeholders lack real-time visibility into key metrics across departments.',
    whyFits: 'Evaluates whether the candidate can build AI-augmented decision support systems that serve multiple stakeholder groups.',
  },
];

export default function StepContext() {
  var updateContext = useAssessmentStore(function (s) { return s.updateContext; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var context = useAssessmentStore(function (s) { return s.context; });

  var [description, setDescription] = useState(context.description || '');
  var [files, setFiles] = useState(context.files || []);
  var [fileDescriptions, setFileDescriptions] = useState(context.fileDescriptions || []);
  var [predicting, setPredicting] = useState(false);
  var [predictions, setPredictions] = useState(null);
  var [selectedPrediction, setSelectedPrediction] = useState(null);
  var [expandedPred, setExpandedPred] = useState(null);

  var handleFileAdd = function (e) {
    var newFiles = Array.from(e.target.files || []);
    setFiles(function (prev) { return prev.concat(newFiles); });
    setFileDescriptions(function (prev) { return prev.concat(newFiles.map(function () { return ''; })); });
  };
  var handleFileRemove = function (idx) {
    setFiles(function (prev) { return prev.filter(function (_, i) { return i !== idx; }); });
    setFileDescriptions(function (prev) { return prev.filter(function (_, i) { return i !== idx; }); });
  };
  var handleFileDescChange = function (idx, val) {
    setFileDescriptions(function (prev) { return prev.map(function (d, i) { return i === idx ? val : d; }); });
  };

  var handlePredict = useCallback(function () {
    setPredicting(true);
    setTimeout(function () {
      setPredicting(false);
      setPredictions(MOCK_PREDICTIONS);
      setSelectedPrediction(MOCK_PREDICTIONS[0].id);
      setDescription(MOCK_PREDICTIONS[0].description);
    }, 2500);
  }, []);

  var handleSelectPrediction = function (pred) {
    setSelectedPrediction(pred.id);
    setDescription(pred.description);
  };

  var handleContinue = function () {
    updateContext({
      description: description,
      files: files.map(function (f) { return f.name || f; }),
      fileDescriptions: fileDescriptions,
      prediction: selectedPrediction,
      predictionSource: selectedPrediction ? 'ai' : 'manual',
    });
    completeStep(2);
  };

  var canContinue = description.trim().length > 10;

  return (
    <div>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: '0 0 4px 0' }}>
            Define the Problem
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
            We'll predict the real business challenges your company may face.
          </p>
        </div>
        {!predictions && (
          <button onClick={handlePredict} disabled={predicting} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '6px 14px', borderRadius: 8,
            border: '1px solid var(--border-default)', backgroundColor: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)',
            cursor: predicting ? 'default' : 'pointer', whiteSpace: 'nowrap',
            opacity: predicting ? 0.6 : 1, flexShrink: 0,
          }}>
            {predicting ? <><Loader2 size={12} className="animate-spin" /> Analyzing...</> : <><Wand2 size={12} style={{ color: 'var(--gold)' }} /> Generate predictions</>}
          </button>
        )}
      </div>

      {/* Left-Right split: input on left, predictions on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 24 }}>
        {/* Left: textarea + upload */}
        <div>
          <textarea
            value={description}
            onChange={function (e) { setDescription(e.target.value); }}
            placeholder="What's the key challenge your team faces? What should this hire solve?"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: '1px solid var(--border-default)', backgroundColor: '#fff',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
              lineHeight: 1.6, resize: 'vertical', minHeight: 120, marginBottom: 14,
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={function (e) { e.target.style.borderColor = 'var(--gold)'; }}
            onBlur={function (e) { e.target.style.borderColor = 'var(--border-default)'; }}
          />

          {/* File upload */}
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            border: '1.5px dashed var(--border-default)', borderRadius: 12,
            padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
            backgroundColor: '#fff', marginBottom: 12,
          }}>
            <input type="file" multiple style={{ display: 'none' }} onChange={handleFileAdd} />
            <Upload size={16} style={{ color: 'var(--brown-light)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginTop: 4 }}>
              Upload reference files
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-light)', marginTop: 2 }}>
              PDF, DOC, CSV, TXT, MD
            </span>
          </label>

          {/* Uploaded files */}
          {files.map(function (f, idx) {
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, backgroundColor: 'var(--cream)', marginBottom: 4 }}>
                <FileText size={11} style={{ color: 'var(--gold)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown)', flex: 1 }}>{f.name || f}</span>
                <button onClick={function () { handleFileRemove(idx); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <X size={10} style={{ color: 'var(--brown-light)' }} />
                </button>
              </div>
            );
          })}

        </div>

        {/* Right: AI predictions */}
        <div style={{ minHeight: 200 }}>
          {predictions ? (
            <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              AI Predictions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {predictions.map(function (pred) {
                var isChosen = selectedPrediction === pred.id;
                var isExpanded = expandedPred === pred.id;
                return (
                  <div
                    key={pred.id}
                    style={{
                      borderRadius: 12,
                      border: isChosen ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
                      backgroundColor: isChosen ? 'rgba(139,105,20,0.03)' : '#fff',
                      overflow: 'hidden', transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Header — clickable to select */}
                    <button
                      onClick={function () { handleSelectPrediction(pred); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '14px 16px', border: 'none', background: 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        {pred.label && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 4 }}>{pred.label}</div>
                        )}
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                          {pred.title}
                        </div>
                      </div>
                      {isChosen && <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />}
                    </button>

                    {/* Expand toggle */}
                    <button
                      onClick={function () { setExpandedPred(isExpanded ? null : pred.id); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4, width: '100%',
                        padding: '0 16px 10px', border: 'none', background: 'transparent',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 10,
                        color: 'var(--brown-soft)',
                      }}
                    >
                      {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      {isExpanded ? 'Collapse' : 'Read more'}
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div style={{ padding: '0 16px 14px', animation: 'fsd .15s ease' }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.6, marginBottom: 10 }}>
                          {pred.description}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--accent-green)', lineHeight: 1.4 }}>
                          <strong>Why this fits:</strong> {pred.whyFits}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          ) : (
          <div style={{
            borderRadius: 12, border: '1px dashed var(--border-default)',
            padding: '32px 20px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <Wand2 size={20} style={{ color: 'var(--brown-light)' }} />
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--brown-soft)' }}>
              AI Predictions
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)', maxWidth: 220, lineHeight: 1.5 }}>
              Click "Generate predictions" to see what challenges your company may face.
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Continue — below grid, always visible when enough text */}
      {canContinue && (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleContinue} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Continue <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
