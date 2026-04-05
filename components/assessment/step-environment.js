'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { cn } from '@/lib/utils';
import { Loader2, Pencil, Check, X, Send, ArrowRight } from 'lucide-react';

function generateMockDocument(task, context, role, selectedRole) {
  const taskName = task.name || 'the assigned task';
  const roleName = selectedRole.name || role.title || 'the role';
  const contextDesc = context.description || 'a business challenge';

  return {
    contextText: `You are a ${roleName} at a mid-sized technology company. The organization is navigating a critical inflection point: ${contextDesc.slice(0, 200)}${contextDesc.length > 200 ? '...' : ''}. Leadership has identified the need for a structured approach to ${taskName.toLowerCase()} and has brought you in to lead this initiative.`,
    yourRoleText: `As the ${roleName}, you will be responsible for analyzing the current state, designing a comprehensive solution, and producing actionable deliverables. You have access to AI tools and are expected to use them effectively while maintaining critical oversight of all outputs. Your work will be reviewed by the VP of Engineering and the CTO.`,
    deliverables: [
      { id: 'd1', text: `A comprehensive ${task.produces || 'deliverable document'} addressing the core business challenge` },
      { id: 'd2', text: 'An executive summary (max 2 pages) with key findings and recommendations' },
      { id: 'd3', text: 'A prioritized action plan with timelines and resource requirements' },
    ],
    resources: [
      { id: 'r1', text: 'Company organizational chart and team structure document' },
      { id: 'r2', text: 'Current quarter OKRs and strategic priorities' },
      { id: 'r3', text: 'Industry benchmark report (provided)' },
    ],
  };
}

function EditableSection({ title, text, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 1500);
  };

  const handleCancel = () => {
    setValue(text);
    setEditing(false);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-mono-label">{title}</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--cream-row-even)]"
          >
            <Pencil size={12} style={{ color: 'var(--brown-soft)' }} />
          </button>
        )}
      </div>
      {editing ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg text-body-sm outline-none resize-none transition-all duration-200"
            style={{
              border: '1px solid var(--gold)',
              backgroundColor: 'var(--cream-card)',
              color: 'var(--brown)',
            }}
            autoFocus
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button type="button" onClick={handleCancel} className="btn-secondary px-3 py-1">
              <X size={12} />
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn-primary px-3 py-1">
              <Check size={12} />
              Save
            </button>
          </div>
        </div>
      ) : (
        <p
          className={cn(
            'text-body-sm leading-relaxed rounded-md px-3 py-2',
            highlighted && 'animate-highlight'
          )}
          style={{ color: 'var(--brown)' }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function EditableList({ title, items, onSave }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(items);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    setValues(items);
  }, [items]);

  const handleItemChange = (idx, val) => {
    setValues((prev) => prev.map((item, i) => (i === idx ? { ...item, text: val } : item)));
  };

  const handleSave = () => {
    onSave(values);
    setEditing(false);
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 1500);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-mono-label">{title}</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--cream-row-even)]"
          >
            <Pencil size={12} style={{ color: 'var(--brown-soft)' }} />
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-2">
          {values.map((item, idx) => (
            <input
              key={item.id}
              type="text"
              value={item.text}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              className="w-full px-3 py-2 rounded-md text-body-sm outline-none"
              style={{
                border: '1px solid var(--gold)',
                backgroundColor: 'var(--cream-card)',
                color: 'var(--brown)',
              }}
            />
          ))}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setValues(items); setEditing(false); }} className="btn-secondary px-3 py-1">
              <X size={12} /> Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn-primary px-3 py-1">
              <Check size={12} /> Save
            </button>
          </div>
        </div>
      ) : (
        <ul className={cn('space-y-1.5', highlighted && 'animate-highlight')}>
          {items.map((item, idx) => (
            <li key={item.id} className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
                style={{
                  backgroundColor: 'var(--cream-row-even)',
                  color: 'var(--brown)',
                }}
              >
                {idx + 1}
              </span>
              <span className="text-body-sm" style={{ color: 'var(--brown)' }}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StepEnvironment() {
  const task = useAssessmentStore((s) => s.task);
  const context = useAssessmentStore((s) => s.context);
  const role = useAssessmentStore((s) => s.role);
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const updateEnvironment = useAssessmentStore((s) => s.updateEnvironment);
  const completeStep = useAssessmentStore((s) => s.completeStep);

  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = generateMockDocument(task, context, role, selectedRole);
      setDoc(generated);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [task, context, role, selectedRole]);

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    // Mock AI response after a delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: `I've updated the assessment environment based on your request: "${userMsg}". The changes have been applied to the relevant sections above.` },
      ]);
    }, 800);
  }, [chatInput]);

  const handleConfirm = () => {
    if (!doc) return;
    updateEnvironment({
      role: selectedRole.name || role.title,
      taskType: task.name,
      jobTitle: role.title,
      contextText: doc.contextText,
      yourRoleText: doc.yourRoleText,
      deliverables: doc.deliverables.map((d) => d.text),
      resources: doc.resources.map((r) => r.text),
      chatHistory: chatMessages,
    });
    completeStep(5);
  };

  if (loading) {
    return (
      <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin mb-4" style={{ color: 'var(--gold)' }} />
        <p className="text-body-lg text-center">Generating assessment environment...</p>
        <p className="text-body-xs mt-1" style={{ color: 'var(--brown-soft)' }}>
          Building a realistic scenario based on your inputs
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <h1 className="text-display-page mb-2">Assessment Environment</h1>
      <p className="text-body-lg mb-6">
        Review and customize the generated assessment document. Click the edit icon to modify any section.
      </p>

      {/* Document */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--cream-card)',
        }}
      >
        <EditableSection
          title="CONTEXT"
          text={doc.contextText}
          onSave={(val) => setDoc({ ...doc, contextText: val })}
        />

        <EditableSection
          title="YOUR ROLE"
          text={doc.yourRoleText}
          onSave={(val) => setDoc({ ...doc, yourRoleText: val })}
        />

        <EditableList
          title="DELIVERABLES"
          items={doc.deliverables}
          onSave={(val) => setDoc({ ...doc, deliverables: val })}
        />

        <EditableList
          title="RESOURCES"
          items={doc.resources}
          onSave={(val) => setDoc({ ...doc, resources: val })}
        />
      </div>

      {/* Chat messages */}
      {chatMessages.length > 0 && (
        <div className="space-y-2 mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-xl px-4 py-3 max-w-[85%] animate-fsu',
                msg.role === 'user' ? 'ml-auto' : ''
              )}
              style={{
                backgroundColor: msg.role === 'user'
                  ? 'rgba(139,105,20,0.06)'
                  : 'var(--cream-row-even)',
                border: msg.role === 'user' ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <p className="text-body-sm" style={{ color: 'var(--brown)' }}>{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chat input bar */}
      <div
        className="flex gap-2 mb-6 rounded-lg p-2"
        style={{
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--cream-card)',
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
          placeholder="Request changes to the assessment environment..."
          className="flex-1 px-3 py-2 rounded-md text-body-sm outline-none"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--brown)',
          }}
        />
        <button
          type="button"
          onClick={handleChatSend}
          disabled={!chatInput.trim()}
          className="btn-primary px-3"
        >
          <Send size={14} />
        </button>
      </div>

      {/* Confirm button */}
      <div className="flex justify-end">
        <button type="button" onClick={handleConfirm} className="btn-primary">
          Confirm Assessment Environment
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
