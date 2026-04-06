'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAssessmentStore } from '@/stores/assessment-store';

var CREATE_TABS = ['Details', 'Candidates', 'Resources'];

export default function CreateAssessmentPage() {
  var router = useRouter();
  var addAssessment = useAppStore(function (s) { return s.addAssessment; });
  var appCandidates = useAppStore(function (s) { return s.candidates; });
  var [activeTab, setActiveTab] = useState('Details');
  var [title, setTitle] = useState('');
  var [spec, setSpec] = useState('');
  var [selectedCandIds, setSelectedCandIds] = useState([]);
  var [resources, setResources] = useState([]);

  var charCount = spec.length;
  var charLimit = 15000;

  var previewTitle = title || 'Untitled Assessment';

  function handleContinue() {
    if (!title.trim()) return;
    // Save assessment
    var id = 'assess-' + Date.now();
    if (addAssessment) {
      addAssessment({
        id: id,
        name: title.trim(),
        roleTitle: title.trim(),
        skill: '',
        task: spec.slice(0, 100),
        status: 'draft',
        candIds: selectedCandIds,
        createdAt: new Date().toISOString(),
      });
    }
    router.push('/assessment/' + id);
  }

  function toggleCandidate(candId) {
    setSelectedCandIds(function (prev) {
      if (prev.includes(candId)) return prev.filter(function (id) { return id !== candId; });
      return prev.concat([candId]);
    });
  }

  function handleFileUpload(e) {
    var files = Array.from(e.target.files || []);
    setResources(function (prev) { return prev.concat(files); });
    e.target.value = '';
  }

  function removeResource(index) {
    setResources(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
  }

  return (
    <div style={{ display: 'flex', margin: '-32px -32px -64px -32px', height: '100vh' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
          <Link href="/assessment" style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', textDecoration: 'none', marginBottom: 12 }}>
            <ArrowLeft size={13} />
            Back to Assessments
          </Link>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>Create Assessment</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>Set up a new work trial to evaluate candidates</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-light)', padding: '0 24px', flexShrink: 0 }}>
          {CREATE_TABS.map(function (tab) {
            var isActive = activeTab === tab;
            return (
              <button key={tab} onClick={function () { setActiveTab(tab); }} style={{
                padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--brown)' : 'var(--brown-soft)',
                borderBottom: isActive ? '2px solid var(--brown)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}>{tab}</button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 100px' }}>
          {/* Details Tab */}
          {activeTab === 'Details' && (
            <div style={{ maxWidth: 640, animation: 'fsu 0.2s ease' }}>
              {/* Title */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)', display: 'block', marginBottom: 8 }}>
                  Title <span style={{ color: 'var(--red)' }}>*</span>
                </label>
                <input
                  type="text" value={title} onChange={function (e) { setTitle(e.target.value); }}
                  placeholder="Frontend Engineer Assessment"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1px solid var(--border-default)', background: '#fff',
                    fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease',
                  }}
                  onFocus={function (e) { e.target.style.borderColor = 'var(--border-hover)'; }}
                  onBlur={function (e) { e.target.style.borderColor = 'var(--border-default)'; }}
                />
              </div>

              {/* Specification */}
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)', display: 'block', marginBottom: 8 }}>
                  Specification <span style={{ color: 'var(--red)' }}>*</span>
                </label>
                <textarea
                  value={spec} onChange={function (e) { setSpec(e.target.value); }}
                  placeholder={'Describe the work trial in markdown...\n\n## Overview\nWhat should the candidate build or accomplish?\n\n## Requirements\n- List specific requirements\n- Be as detailed as possible\n\n## Deliverables\nWhat should the candidate submit?'}
                  rows={16}
                  style={{
                    width: '100%', padding: '16px 18px', borderRadius: 10,
                    border: '1px solid var(--border-default)', background: '#fff',
                    fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
                    lineHeight: 1.6, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={function (e) { e.target.style.borderColor = 'var(--border-hover)'; }}
                  onBlur={function (e) { e.target.style.borderColor = 'var(--border-default)'; }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>Markdown supported. Preview shown on the right.</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{charCount} / {charLimit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Candidates Tab */}
          {activeTab === 'Candidates' && (
            <div style={{ maxWidth: 640, animation: 'fsu 0.2s ease' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)', marginBottom: 12 }}>
                Assign Candidates ({selectedCandIds.length})
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 20 }}>
                Select candidates to invite to this assessment.
              </p>

              {appCandidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>No candidates in your pool yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {appCandidates.map(function (cand) {
                    var selected = selectedCandIds.includes(cand.id);
                    return (
                      <div key={cand.id} onClick={function () { toggleCandidate(cand.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10,
                          border: '1px solid ' + (selected ? 'var(--border-hover)' : 'var(--border-default)'),
                          background: selected ? 'rgba(139,105,20,0.04)' : '#fff', cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          border: '1.5px solid ' + (selected ? 'var(--gold)' : 'var(--border-default)'),
                          background: selected ? 'var(--gold)' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {selected && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--brown)' }}>{cand.name}</div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)' }}>{cand.email}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'Resources' && (
            <div style={{ maxWidth: 640, animation: 'fsu 0.2s ease' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--brown)', marginBottom: 12 }}>Resources</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 20 }}>
                Upload files candidates will need for this assessment. Max 5 files, 500 MB each.
              </p>

              {/* Upload area */}
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '32px 20px',
                borderRadius: 12, border: '2px dashed var(--border-default)', cursor: 'pointer', transition: 'all 0.15s ease',
                backgroundColor: 'var(--cream)',
              }}>
                <Upload size={24} style={{ color: 'var(--brown-soft)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 500 }}>Click to upload</span> or drag and drop
                </span>
                <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              {/* File list */}
              {resources.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                  {resources.map(function (f, i) {
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', flex: 1 }}>{f.name}</span>
                        <button onClick={function () { removeResource(i); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brown-soft)', padding: 2 }}><X size={14} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom action bar */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
          <button onClick={handleContinue} disabled={!title.trim()} className="btn-primary" style={{ opacity: title.trim() ? 1 : 0.5, padding: '10px 32px' }}>
            Continue
          </button>
        </div>
      </div>

      {/* Right panel - Live Preview */}
      <div style={{ width: 340, flexShrink: 0, borderLeft: '1px solid var(--border-default)', backgroundColor: '#fff', overflowY: 'auto', padding: '24px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600, color: title ? 'var(--brown)' : 'var(--brown-light)', marginBottom: 4 }}>
          {previewTitle}
        </h2>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginBottom: 20 }}>Live Preview</div>

        {!spec && !title ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-light)', fontStyle: 'italic', lineHeight: 1.6 }}>
            Start typing your specification to see the preview...
          </p>
        ) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {spec}
          </div>
        )}

        {selectedCandIds.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginBottom: 8 }}>CANDIDATES</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{selectedCandIds.length} assigned</span>
          </div>
        )}

        {resources.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', marginBottom: 8 }}>RESOURCES</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>{resources.length} files</span>
          </div>
        )}
      </div>
    </div>
  );
}
