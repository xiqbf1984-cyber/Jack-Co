'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Link2, Upload, Send, ArrowRight } from 'lucide-react';

const SAMPLE_JD = `AI Research Engineer — Anthropic

We're looking for an AI Research Engineer to design and build frontier AI systems for large-scale ML experiments. You'll work on model architecture, training infrastructure, and evaluation systems.

Key Responsibilities:
• Design and implement novel model architectures
• Build scalable training pipelines for large language models
• Develop evaluation frameworks and safety benchmarks
• Collaborate with research scientists on production implementations

Requirements:
• 3+ years experience in ML engineering or research
• Strong proficiency in Python, PyTorch
• Experience with distributed training systems
• Published research or significant open-source contributions preferred

Salary: $180k–$250k · Remote`;

export default function StepRole() {
  const updateRole = useAssessmentStore((s) => s.updateRole);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const [path, setPath] = useState('jd');
  const [textValue, setTextValue] = useState(role.jd || '');
  const [hasContent, setHasContent] = useState(!!role.jd);

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
    setHasContent(!!e.target.value.trim());
  };

  const handleUseSample = () => {
    setTextValue(SAMPLE_JD);
    setHasContent(true);
    handleSubmitJD(SAMPLE_JD);
  };

  const handleSubmitJD = useCallback((jdText) => {
    const text = jdText || textValue;
    if (!text.trim()) return;

    // Parse JD (simple regex extraction)
    const lines = text.split('\n');
    const titleMatch = lines[0] || '';
    const companyMatch = titleMatch.split('—')[1]?.trim() || titleMatch.split('-')[1]?.trim() || '';
    const title = titleMatch.split('—')[0]?.trim() || titleMatch.split('-')[0]?.trim() || 'New Role';

    const link = 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10);

    updateRole({
      jd: text,
      title,
      company: companyMatch,
      sharableLink: link,
      parsedFrom: 'text',
      matchConfidence: 85,
    });

    completeStep(0);
  }, [textValue, updateRole, completeStep]);

  const handleContinue = () => {
    handleSubmitJD(textValue);
  };

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
          What role are you hiring for? Paste a JD, upload a file, or describe the position.
        </p>
      </div>

      {/* Path toggle */}
      <div style={{
        display: 'flex',
        borderRadius: 20,
        backgroundColor: 'var(--cream-row-even)',
        padding: 3,
        marginBottom: 20,
      }}>
        {[
          { id: 'jd', label: 'I have a JD' },
          { id: 'help', label: 'Help me write one' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPath(tab.id)}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 18,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: path === tab.id ? 600 : 400,
              color: path === tab.id ? 'var(--brown)' : 'var(--brown-soft)',
              backgroundColor: path === tab.id ? '#fff' : 'transparent',
              boxShadow: path === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Path A: I have a JD */}
      {path === 'jd' && (
        <div style={{ animation: 'fsu .2s ease' }}>
          {/* Textarea container */}
          <div style={{
            borderRadius: 16,
            border: `1.5px solid ${hasContent ? 'var(--border-hover)' : 'var(--border-default)'}`,
            backgroundColor: '#fff',
            padding: '16px 18px',
            animation: !hasContent ? 'inputGlow 3s ease-in-out infinite' : undefined,
            transition: 'border-color 0.2s ease',
          }}>
            <textarea
              value={textValue}
              onChange={handleTextChange}
              placeholder="Paste your JD here or describe the role..."
              style={{
                width: '100%',
                border: 'none',
                background: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                lineHeight: 1.6,
                minHeight: 80,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Bottom toolbar */}
            <div style={{
              borderTop: '1px solid var(--border-light)',
              marginTop: 12,
              paddingTop: 10,
              display: 'flex',
              alignItems: 'center',
            }}>
              {/* Left buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Link2 size={14} style={{ color: 'var(--brown-light)' }} />
                </button>
                <button style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Upload size={14} style={{ color: 'var(--brown-light)' }} />
                </button>
              </div>

              {/* Right send button */}
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={handleContinue}
                  disabled={!hasContent}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: 'none',
                    cursor: hasContent ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hasContent ? 'var(--gold)' : 'var(--cream-row-even)',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Send size={14} style={{ color: hasContent ? '#fff' : 'var(--brown-light)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginTop: 24,
          }}>
            <button
              onClick={handleContinue}
              disabled={!hasContent}
              className="btn-primary"
              style={{ opacity: hasContent ? 1 : 0.5 }}
            >
              Continue
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleUseSample}
              className="btn-secondary"
            >
              Use sample JD
            </button>
          </div>
        </div>
      )}

      {/* Path B: Help me write one */}
      {path === 'help' && (
        <div style={{
          animation: 'fsu .2s ease',
          textAlign: 'center',
          padding: '40px 20px',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-muted)',
            marginBottom: 16,
          }}>
            AI-assisted role creation coming soon. For now, paste your JD or describe the role above.
          </p>
          <button
            onClick={() => setPath('jd')}
            className="btn-secondary"
          >
            Switch to "I have a JD"
          </button>
        </div>
      )}
    </div>
  );
}
