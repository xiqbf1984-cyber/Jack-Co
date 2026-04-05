'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { cn } from '@/lib/utils';
import { Sparkles, Upload, X, ArrowRight, Loader2, Check, FileText, Lightbulb } from 'lucide-react';

const MOCK_PREDICTIONS = [
  {
    id: 'pred-1',
    title: 'AI Integration Bottleneck',
    description: 'Your team is struggling to integrate AI tools into existing workflows, leading to duplicated effort and inconsistent outputs across projects.',
    whyFits: 'This aligns with the selected task type and tests the candidate\'s ability to design practical human-AI collaboration patterns.',
  },
  {
    id: 'pred-2',
    title: 'Scaling Knowledge Management',
    description: 'As the team grows, institutional knowledge is siloed. New hires take 3-4 months to become productive because documentation is scattered and outdated.',
    whyFits: 'Tests the candidate\'s ability to design systems that capture and distribute organizational knowledge using AI tools.',
  },
  {
    id: 'pred-3',
    title: 'Cross-functional Decision Latency',
    description: 'Strategic decisions are delayed because data analysis takes too long and stakeholders lack real-time visibility into key metrics.',
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
    }, 1500);
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
    <div className="max-w-[640px] mx-auto">
      <h1 className="text-display-page mb-2">What business problem should this candidate solve?</h1>
      <p className="text-body-lg mb-6">
        Give context about the real challenge your team faces. This helps generate a realistic assessment.
      </p>

      {/* AI intro bubble */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{
          backgroundColor: 'rgba(139,105,20,0.04)',
          border: '1px solid var(--border-light)',
        }}
      >
        <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
        <div>
          <p className="text-body-sm" style={{ color: 'var(--brown)' }}>
            You selected <strong>{task.name || 'a task'}</strong>. Describe the business scenario
            the candidate should work on. Be specific about your team's current challenges.
          </p>
        </div>
      </div>

      {/* Main textarea */}
      <div className="mb-4">
        <label className="text-mono-label block mb-2">BUSINESS CONTEXT</label>
        <textarea
          placeholder="Describe your team's current challenges and what you'd like this candidate to solve..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg text-body-sm outline-none resize-none transition-all duration-200"
          style={{
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--cream-card)',
            color: 'var(--brown)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
      </div>

      {/* File upload zone */}
      <div className="mb-6">
        <label className="text-mono-label block mb-2">SUPPORTING FILES (OPTIONAL)</label>
        <label
          className="flex flex-col items-center justify-center w-full py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-[var(--gold)]"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--cream-card)',
          }}
        >
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileAdd}
          />
          <Upload size={18} style={{ color: 'var(--brown-soft)' }} />
          <p className="text-body-xs mt-2" style={{ color: 'var(--brown-soft)' }}>
            Drop files here or click to browse
          </p>
        </label>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg p-3"
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                }}
              >
                <FileText size={14} style={{ color: 'var(--brown-soft)' }} />
                <span className="text-body-sm font-semibold flex-shrink-0" style={{ color: 'var(--brown)' }}>
                  {f.name || f}
                </span>
                <input
                  type="text"
                  placeholder="Describe this file..."
                  value={fileDescriptions[idx] || ''}
                  onChange={(e) => handleFileDescChange(idx, e.target.value)}
                  className="flex-1 px-2 py-1 rounded text-body-xs outline-none"
                  style={{
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--cream)',
                    color: 'var(--brown)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleFileRemove(idx)}
                  className="p-1 rounded hover:bg-[var(--cream-row-even)] transition-colors"
                >
                  <X size={12} style={{ color: 'var(--brown-soft)' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Predict button */}
      {!predictions && (
        <button
          type="button"
          onClick={handlePredict}
          disabled={predicting}
          className="btn-secondary w-full justify-center"
        >
          {predicting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing business challenges...
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
        <div className="mt-6 space-y-3 animate-fsu">
          <span className="text-mono-label flex items-center gap-2">
            <Sparkles size={10} style={{ color: 'var(--gold)' }} />
            AI-SUGGESTED CHALLENGES
          </span>
          {predictions.map((pred) => {
            const isChosen = selectedPrediction === pred.id;
            return (
              <div
                key={pred.id}
                className="rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
                style={{
                  border: isChosen
                    ? '2px solid var(--accent-green)'
                    : '1px solid var(--border-default)',
                  backgroundColor: isChosen ? 'rgba(39,130,91,0.04)' : 'var(--cream-card)',
                }}
              >
                <h3 className="text-body-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>
                  {pred.title}
                </h3>
                <p className="text-body-xs mb-2" style={{ color: 'var(--brown-soft)' }}>
                  {pred.description}
                </p>
                <div
                  className="rounded-md px-3 py-2 mb-3"
                  style={{ backgroundColor: 'rgba(139,105,20,0.04)' }}
                >
                  <p className="text-body-xs">
                    <strong style={{ color: 'var(--gold)' }}>Why this fits:</strong>{' '}
                    <span style={{ color: 'var(--brown-soft)' }}>{pred.whyFits}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPrediction(pred)}
                  className={cn(
                    'text-body-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200',
                    isChosen ? 'btn-primary' : 'btn-secondary'
                  )}
                >
                  {isChosen ? (
                    <>
                      <Check size={12} />
                      Selected
                    </>
                  ) : (
                    'Select this'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue */}
      {canContinue && (
        <div className="mt-8 flex justify-end animate-fsu">
          <button type="button" onClick={handleContinue} className="btn-primary">
            Continue
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
