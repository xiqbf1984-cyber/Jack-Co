'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Paperclip, Link2, Mic, X, FileText, Check, Code2, Briefcase, Settings } from 'lucide-react';

const TYPEWRITER_TEXT = 'Who are you looking for?';
const TYPEWRITER_SPEED = 38;

const EXAMPLE_SUGGESTIONS = [
  { icon: Code2, label: 'Backend Engineer in London' },
  { icon: Briefcase, label: 'Product Manager, Remote (US)' },
  { icon: Settings, label: 'Senior Designer in SF' },
];

export default function SearchPage({ onSubmit }) {
  const [input, setInput] = useState('');
  const [twText, setTwText] = useState('');
  const [twDone, setTwDone] = useState(false);
  const [keepPrivate, setKeepPrivate] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTwText(TYPEWRITER_TEXT.slice(0, i));
      if (i >= TYPEWRITER_TEXT.length) {
        clearInterval(timer);
        setTwDone(true);
      }
    }, TYPEWRITER_SPEED);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e) {
    e?.preventDefault();
    var text = input.trim();
    if (!text) return;
    onSubmit?.(text);
  }

  function handleSuggestionClick(label) {
    setInput(label);
    textareaRef.current?.focus();
  }

  function handleLinkSubmit() {
    if (!linkValue.trim()) return;
    setInput(prev => {
      var trimmed = prev.trim();
      return trimmed ? trimmed + '\n' + linkValue.trim() : linkValue.trim();
    });
    setLinkValue('');
    setShowLinkModal(false);
    textareaRef.current?.focus();
  }

  function handleFileSelect(e) {
    var files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadedFiles(prev => [...prev, ...files]);
    var names = files.map(f => f.name).join(', ');
    setInput(prev => {
      var trimmed = prev.trim();
      return trimmed ? trimmed + '\n[Attached: ' + names + ']' : '[Attached: ' + names + ']';
    });
    setShowFileModal(false);
    e.target.value = '';
    textareaRef.current?.focus();
  }

  function removeFile(index) {
    var file = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setInput(prev => prev.replace('[Attached: ' + file.name + ']', '').trim());
  }

  function toggleRecording() {
    setIsRecording(!isRecording);
    // Simulated voice input
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  }

  var hasInput = input.trim().length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '40px 24px',
    }}>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--brown)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 1.2,
      }}>
        {twText}
        {!twDone && (
          <span style={{
            display: 'inline-block',
            width: 2,
            height: '0.85em',
            backgroundColor: 'var(--brown)',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 1s step-end infinite',
          }} />
        )}
      </h1>

      {/* Content */}
      <div style={{
        opacity: twDone ? 1 : 0,
        transition: 'opacity 0.4s ease',
        width: '100%',
        maxWidth: 580,
      }}>
        {/* Search card */}
        <form onSubmit={handleSubmit}>
          <div style={{
            position: 'relative',
            borderRadius: 16,
            border: '1.5px solid ' + (hasInput ? 'var(--border-hover)' : 'var(--border-default)'),
            backgroundColor: '#fff',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
            boxShadow: hasInput ? '0 2px 12px rgba(0,0,0,0.04)' : undefined,
            animation: !hasInput ? 'inputGlow 3s infinite' : undefined,
          }}>
            <textarea
              ref={textareaRef}
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Paste a link to your JD or describe your next hire..."
              style={{
                width: '100%',
                padding: '18px 20px 8px',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--brown)',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Keep role private checkbox */}
            <div style={{
              padding: '0 20px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <button
                type="button"
                onClick={() => setKeepPrivate(!keepPrivate)}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  border: '1.5px solid ' + (keepPrivate ? 'var(--gold)' : 'var(--border-default)'),
                  background: keepPrivate ? 'var(--gold)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {keepPrivate && <Check size={9} color="#fff" strokeWidth={3} />}
              </button>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown-soft)',
                userSelect: 'none',
                cursor: 'pointer',
              }} onClick={() => setKeepPrivate(!keepPrivate)}>
                Keep role private
              </span>
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div style={{ padding: '4px 20px 4px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 8px',
                    borderRadius: 6,
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--border-default)',
                    fontSize: 10,
                    color: 'var(--brown)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    <FileText size={10} style={{ color: 'var(--brown-soft)' }} />
                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} style={{
                      border: 'none', background: 'none', padding: 0, cursor: 'pointer',
                      color: 'var(--brown-soft)', display: 'flex',
                    }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px 10px',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  title="Attach a file"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: '#c0392b',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Paperclip size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  title="Paste a link"
                  onClick={() => setShowLinkModal(true)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: '#c0392b',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Link2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--brown-soft)',
                  userSelect: 'none',
                }}>Press space to speak</span>
                <button
                  type="button"
                  onClick={toggleRecording}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none',
                    background: isRecording
                      ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                      : 'linear-gradient(135deg, #e67e22, #d35400)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isRecording ? '0 0 0 4px rgba(231,76,60,0.2)' : 'none',
                  }}
                >
                  <Mic size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Example suggestions */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 20,
          }}>
            {EXAMPLE_SUGGESTIONS.map((s) => {
              var Icon = s.icon;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleSuggestionClick(s.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: '1px solid var(--border-default)',
                    backgroundColor: '#fff',
                    color: 'var(--brown)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.backgroundColor = 'var(--cream)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={13} style={{ color: 'var(--brown-soft)' }} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </form>

        {/* Submit button floating */}
        {hasInput && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none',
                background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(92,82,72,0.18)',
                animation: 'fsu 0.2s ease both',
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Link paste modal */}
      {showLinkModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }} onClick={() => setShowLinkModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '24px',
            width: '100%',
            maxWidth: 420,
            boxShadow: 'var(--shadow-modal)',
            animation: 'fadeScale 0.2s ease both',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--brown)',
              marginBottom: 16,
            }}>Paste a link</h3>
            <div style={{
              display: 'flex',
              gap: 8,
            }}>
              <input
                autoFocus
                type="url"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSubmit(); }}
                placeholder="https://example.com/job-description"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--border-default)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  outline: 'none',
                  background: 'var(--cream)',
                }}
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="btn-primary"
                style={{ padding: '10px 18px', fontSize: 12 }}
              >Add</button>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown-soft)',
              marginTop: 10,
            }}>Paste a job description URL and we'll extract the details.</p>
          </div>
        </div>
      )}
    </div>
  );
}
