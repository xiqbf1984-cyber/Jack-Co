'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Upload, X, FileText, Sparkles, Loader2, Check, ArrowRight } from 'lucide-react';

const MOCK_PREDICTIONS = [
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
  const updateContext = useAssessmentStore((s) => s.updateContext);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const context = useAssessmentStore((s) => s.context);
  const task = useAssessmentStore((s) => s.task);

  const [description, setDescription] = useState(context.description || '');
  const [files, setFiles] = useState(context.files || []);
  const [fileDescriptions, setFileDescriptions] = useState(context.fileDescriptions || []);
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    setFileDescriptions((prev) => [...prev, ...newFiles.map(() => '')]);
  };

  const handleFileRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileDescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileDescChange = (idx, val) => {
    setFileDescriptions((prev) => prev.map((d, i) => (i === idx ? val : d)));
  };

  const handlePredict = useCallback(() => {
    setPredicting(true);
    setTimeout(() => {
      setPredicting(false);
      setPredictions(MOCK_PREDICTIONS);
    }, 2500);
  }, []);

  const handleSelectPrediction = (pred) => {
    setSelectedPrediction(pred.id);
    setDescription(pred.description);
  };

  const handleContinue = () => {
    updateContext({
      description,
      files: files.map((f) => f.name || f),
      fileDescriptions,
      prediction: selectedPrediction,
      predictionSource: selectedPrediction ? 'ai' : 'manual',
    });
    completeStep(4);
  };

  const canContinue = description.trim().length > 10;

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
          What business problem should this candidate solve? Describe your challenge, upload reference files, or let me predict likely challenges based on your context.
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your team's current challenges, what problems you face, what you'd want this hire to solve..."
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid var(--border-default)',
          backgroundColor: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown)',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: 100,
          marginBottom: 16,
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
      />

      {/* File upload */}
      <label style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px dashed var(--border-default)',
        borderRadius: 14,
        padding: '28px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#fff',
        marginBottom: 16,
        transition: 'border-color 0.15s ease',
      }}>
        <input
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileAdd}
        />
        <Upload size={20} style={{ color: 'var(--brown-light)' }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown-muted)',
          marginTop: 6,
        }}>
          Upload reference files
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: 'var(--brown-light)',
          marginTop: 4,
        }}>
          PDF, DOC, CSV, TXT, MD, Images
        </span>
      </label>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {files.map((f, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '8px 12px',
              borderRadius: 10,
              backgroundColor: 'var(--cream-card)',
              marginBottom: 5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={12} style={{ color: 'var(--gold)' }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--brown)',
                  flex: 1,
                }}>
                  {f.name || f}
                </span>
                <button
                  onClick={() => handleFileRemove(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                >
                  <X size={11} style={{ color: 'var(--brown-light)' }} />
                </button>
              </div>
              <input
                type="text"
                value={fileDescriptions[idx] || ''}
                onChange={(e) => handleFileDescChange(idx, e.target.value)}
                placeholder="What is this file about?"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  backgroundColor: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--brown)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Predict button */}
      {!predictions && (
        <button
          onClick={handlePredict}
          disabled={predicting}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}
        >
          {predicting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing your context...
            </>
          ) : (
            <>
              <Sparkles size={14} style={{ color: 'var(--gold)' }} />
              Predict business challenges
            </>
          )}
        </button>
      )}

      {/* Prediction cards */}
      {predictions && (
        <div style={{ marginBottom: 20 }}>
          {predictions.map((pred, i) => {
            const isChosen = selectedPrediction === pred.id;
            return (
              <button
                key={pred.id}
                onClick={() => handleSelectPrediction(pred)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '18px 20px',
                  borderRadius: 14,
                  border: isChosen
                    ? '1.5px solid rgba(39,130,91,0.33)'
                    : '1.5px solid var(--border-default)',
                  backgroundColor: isChosen ? 'rgba(39,130,91,0.04)' : '#fff',
                  cursor: 'pointer',
                  marginBottom: 10,
                  animation: `fsu .2s ease ${i * 0.06}s both`,
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                }}
              >
                {/* Label for first */}
                {pred.label && (
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: 'var(--gold)',
                    marginBottom: 6,
                  }}>
                    {pred.label}
                  </div>
                )}

                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  fontWeight: 700,
                  marginBottom: 6,
                }}>
                  {pred.title}
                </div>

                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown-muted)',
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}>
                  {pred.description}
                </div>

                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--accent-green)',
                  lineHeight: 1.4,
                }}>
                  <strong>Why this fits:</strong> {pred.whyFits}
                </div>

                {isChosen && (
                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                    <Check size={14} style={{ color: 'var(--accent-green)' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Continue button */}
      {canContinue && (
        <div style={{ animation: 'fsu .2s ease' }}>
          <button onClick={handleContinue} className="btn-primary">
            Continue
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
