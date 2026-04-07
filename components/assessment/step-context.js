'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Upload, X, FileText, Loader2, Check, ArrowRight, Wand2, ChevronDown, ChevronUp } from 'lucide-react';

var MOCK_PREDICTIONS = [
  {
    id: 'pred-1',
    label: 'Most Likely',
    title: 'AI Autonomous Remediation Governance Failure',
    whyFits: 'Design human-AI handoff protocols and confidence routing that prevent unsupervised actions in critical systems.',
  },
  {
    id: 'pred-2',
    title: 'Scaling Knowledge Management Across Distributed Teams',
    whyFits: 'Design systems that capture and distribute organizational knowledge using AI tools.',
  },
  {
    id: 'pred-3',
    title: 'Cross-functional Decision Latency at Scale',
    whyFits: 'Build AI-augmented decision support systems that serve multiple stakeholder groups.',
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

  var handlePredict = useCallback(function () {
    setPredicting(true);
    setTimeout(function () {
      setPredicting(false);
      setPredictions(MOCK_PREDICTIONS);
      setSelectedPrediction(MOCK_PREDICTIONS[0].id);
      setDescription(MOCK_PREDICTIONS[0].title);
    }, 2500);
  }, []);

  var handleSelectPrediction = function (pred) {
    setSelectedPrediction(pred.id);
    setDescription(pred.title);
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
        <div>
          {predictions ? (
            <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              AI Predictions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {predictions.map(function (pred) {
                var isChosen = selectedPrediction === pred.id;
                var isExpanded = expandedPred === pred.id;
                return (
                  <div
                    key={pred.id}
                    style={{
                      borderRadius: 10,
                      border: isChosen ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
                      backgroundColor: isChosen ? 'rgba(139,105,20,0.03)' : '#fff',
                      overflow: 'hidden', transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Header — clickable to select, with inline expand toggle */}
                    <button
                      onClick={function () { handleSelectPrediction(pred); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '10px 14px', border: 'none', background: 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {pred.label && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 2 }}>{pred.label}</div>
                        )}
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)' }}>
                          {pred.title}
                        </div>
                      </div>
                      {isChosen && <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />}
                      <button
                        onClick={function (e) { e.stopPropagation(); setExpandedPred(isExpanded ? null : pred.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', background: 'none',
                          border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0,
                          color: 'var(--brown-soft)',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </button>

                    {/* Expanded content — just whyFits */}
                    {isExpanded && (
                      <div style={{ padding: '0 14px 10px', animation: 'fsd .15s ease' }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--accent-green)', lineHeight: 1.4 }}>
                          {pred.whyFits}
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
            borderRadius: 10, border: '1px dashed var(--border-default)',
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

      {/* Continue — always visible, sticky at bottom */}
      <div style={{
        position: 'sticky', bottom: 0,
        padding: '16px 0', marginTop: 20,
        backgroundColor: 'var(--cream)',
      }}>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="btn-primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            opacity: canContinue ? 1 : 0.4,
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
