'use client';

import { useState, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { cn } from '@/lib/utils';
import { Link2, Upload, FileText, Sparkles, ArrowRight, Loader2, Check } from 'lucide-react';

const JD_TABS = [
  { id: 'link', label: 'Paste link', icon: Link2 },
  { id: 'upload', label: 'Upload file', icon: Upload },
  { id: 'text', label: 'Paste text', icon: FileText },
];

const CHAT_QUESTIONS = [
  { id: 'title', question: 'What is the job title for this role?' },
  { id: 'responsibilities', question: 'What will this person be responsible for?' },
  { id: 'requirements', question: 'What are the key requirements and qualifications?' },
];

export default function StepRole() {
  const updateRole = useAssessmentStore((s) => s.updateRole);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const [path, setPath] = useState('jd'); // 'jd' | 'help'
  const [jdTab, setJdTab] = useState('text');
  const [linkValue, setLinkValue] = useState('');
  const [textValue, setTextValue] = useState(role.jd || '');
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);

  // Chat state
  const [chatStep, setChatStep] = useState(0);
  const [chatAnswers, setChatAnswers] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [generatedJD, setGeneratedJD] = useState('');

  const handleParse = useCallback(() => {
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      const mockParsed = {
        title: 'AI-Augmented Software Engineer',
        company: 'Anthropic',
        responsibilities: 'Build and maintain AI-powered development tools. Design scalable architectures for ML systems. Collaborate with research teams on production implementations.',
      };
      setParsed(mockParsed);
      updateRole({
        title: mockParsed.title,
        company: mockParsed.company,
        jd: textValue || linkValue || fileName,
        parsedFrom: jdTab,
      });
    }, 1000);
  }, [textValue, linkValue, fileName, jdTab, updateRole]);

  const handleChatSubmit = useCallback(() => {
    if (!chatInput.trim()) return;
    const currentQ = CHAT_QUESTIONS[chatStep];
    const newAnswers = { ...chatAnswers, [currentQ.id]: chatInput.trim() };
    setChatAnswers(newAnswers);
    setChatInput('');

    if (chatStep < CHAT_QUESTIONS.length - 1) {
      setChatStep(chatStep + 1);
    } else {
      const jd = `Title: ${newAnswers.title}\n\nResponsibilities:\n${newAnswers.responsibilities}\n\nRequirements:\n${newAnswers.requirements}`;
      setGeneratedJD(jd);
      updateRole({
        title: newAnswers.title,
        jd,
        parsedFrom: 'chat',
      });
    }
  }, [chatInput, chatStep, chatAnswers, updateRole]);

  const handleContinue = () => {
    completeStep(0);
  };

  const canContinue = parsed || generatedJD;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      <h1 className="text-display-page mb-2">What role are you hiring for?</h1>
      <p className="text-body-lg mb-6">
        Start with a job description or let us help you write one.
      </p>

      {/* Path tabs */}
      <div
        className="flex rounded-lg p-1 mb-6 gap-1"
        style={{ backgroundColor: 'var(--cream-row-even)' }}
      >
        {[
          { id: 'jd', label: 'I have a JD' },
          { id: 'help', label: 'Help me write one' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPath(tab.id)}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-body-sm font-semibold transition-all duration-200',
              path === tab.id
                ? 'shadow-sm'
                : 'hover-bg-cream-card-hover'
            )}
            style={{
              color: path === tab.id ? 'var(--brown)' : 'var(--brown-soft)',
              backgroundColor: path === tab.id ? 'var(--cream-card)' : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Path A: I have a JD */}
      {path === 'jd' && (
        <div className="animate-fsu">
          {/* Sub-option tabs */}
          <div className="flex gap-2 mb-5">
            {JD_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setJdTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm transition-all duration-200',
                    jdTab === tab.id
                      ? 'border-2'
                      : 'border hover-border-hover'
                  )}
                  style={{
                    borderColor: jdTab === tab.id ? 'var(--gold)' : 'var(--border-default)',
                    backgroundColor: jdTab === tab.id ? 'rgba(139,105,20,0.04)' : 'var(--cream-card)',
                    color: jdTab === tab.id ? 'var(--gold)' : 'var(--brown)',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Input area based on selected tab */}
          {jdTab === 'link' && (
            <input
              type="url"
              placeholder="https://careers.example.com/job/12345"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-body-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--cream-card)',
                color: 'var(--brown)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
            />
          )}

          {jdTab === 'upload' && (
            <label
              className="flex flex-col items-center justify-center w-full h-36 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 hover-border-gold"
              style={{
                borderColor: fileName ? 'var(--accent-green)' : 'var(--border-default)',
                backgroundColor: 'var(--cream-card)',
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName ? (
                <div className="flex items-center gap-2">
                  <Check size={16} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-body-sm font-semibold">{fileName}</span>
                </div>
              ) : (
                <>
                  <Upload size={20} style={{ color: 'var(--brown-soft)' }} />
                  <p className="text-body-sm mt-2" style={{ color: 'var(--brown-soft)' }}>
                    Drop a PDF, DOC, or TXT file here
                  </p>
                  <p className="text-body-xs mt-1">or click to browse</p>
                </>
              )}
            </label>
          )}

          {jdTab === 'text' && (
            <textarea
              placeholder="Paste your full job description here..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-lg text-body-sm outline-none resize-none transition-all duration-200"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--cream-card)',
                color: 'var(--brown)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
            />
          )}

          {/* Parse button */}
          {!parsed && (
            <button
              type="button"
              onClick={handleParse}
              disabled={parsing || (!linkValue && !textValue && !fileName)}
              className="btn-primary mt-4"
            >
              {parsing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Parsing JD...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Parse JD
                </>
              )}
            </button>
          )}

          {/* Parsed results */}
          {parsed && (
            <div
              className="mt-5 rounded-xl p-5 animate-fsu"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--cream-card)',
              }}
            >
              <h3
                className="text-mono-label mb-3 flex items-center gap-2"
              >
                <Check size={12} style={{ color: 'var(--accent-green)' }} />
                PARSED FROM JD
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-body-xs block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={parsed.title}
                    onChange={(e) => {
                      setParsed({ ...parsed, title: e.target.value });
                      updateRole({ title: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-md text-body-sm outline-none"
                    style={{
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--cream)',
                      color: 'var(--brown)',
                    }}
                  />
                </div>
                <div>
                  <label className="text-body-xs block mb-1">Company</label>
                  <input
                    type="text"
                    value={parsed.company}
                    onChange={(e) => {
                      setParsed({ ...parsed, company: e.target.value });
                      updateRole({ company: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-md text-body-sm outline-none"
                    style={{
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--cream)',
                      color: 'var(--brown)',
                    }}
                  />
                </div>
                <div>
                  <label className="text-body-xs block mb-1">Responsibilities</label>
                  <textarea
                    value={parsed.responsibilities}
                    onChange={(e) =>
                      setParsed({ ...parsed, responsibilities: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-md text-body-sm outline-none resize-none"
                    style={{
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--cream)',
                      color: 'var(--brown)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Path B: Help me write one */}
      {path === 'help' && (
        <div className="animate-fsu space-y-3">
          {/* Chat messages */}
          {CHAT_QUESTIONS.slice(0, chatStep + 1).map((q, i) => (
            <div key={q.id}>
              {/* AI message */}
              <div
                className="rounded-xl p-4 mb-2"
                style={{
                  backgroundColor: 'var(--cream-row-even)',
                  maxWidth: '85%',
                }}
              >
                <p className="text-body-sm">{q.question}</p>
              </div>
              {/* User answer */}
              {chatAnswers[q.id] && (
                <div
                  className="rounded-xl p-4 mb-2 ml-auto"
                  style={{
                    backgroundColor: 'rgba(139,105,20,0.06)',
                    border: '1px solid var(--border-light)',
                    maxWidth: '85%',
                  }}
                >
                  <p className="text-body-sm">{chatAnswers[q.id]}</p>
                </div>
              )}
            </div>
          ))}

          {/* Chat input */}
          {!generatedJD && (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 rounded-lg text-body-sm outline-none transition-all duration-200"
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                  color: 'var(--brown)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
              />
              <button
                type="button"
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                className="btn-primary"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Generated JD */}
          {generatedJD && (
            <div
              className="rounded-xl p-5 animate-fsu"
              style={{
                border: '1px solid var(--accent-green)',
                backgroundColor: 'rgba(39,130,91,0.04)',
              }}
            >
              <h3 className="text-mono-label mb-2 flex items-center gap-2">
                <Sparkles size={12} style={{ color: 'var(--gold)' }} />
                GENERATED JD
              </h3>
              <pre
                className="text-body-sm whitespace-pre-wrap"
                style={{ color: 'var(--brown)', fontFamily: 'var(--font-body)' }}
              >
                {generatedJD}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
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
