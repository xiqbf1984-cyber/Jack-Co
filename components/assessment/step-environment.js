'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Loader2, Pencil, Send, ArrowRight } from 'lucide-react';

function generateMockDocument(task, context, role, selectedRole) {
  const taskName = task.name || 'the assigned task';
  const roleName = selectedRole.name || role.title || 'the role';
  const contextDesc = context.description || 'a business challenge';

  return {
    contextText: `Lenovo launched Smart Store Services and the xIQ Digital Workplace Platform at NRF in January. Your team embedded with a 750-location US convenience and fuel retailer six weeks ago for the xIQ MVP deployment. Proactive remediation is resolving 38% of device health issues autonomously, but the remaining incidents—especially POS terminal failures during peak hours—require immediate human attention. ${contextDesc.slice(0, 200)}`,
    yourRoleText: `You're a Principal Digital Transformation Consultant in Lenovo SSG, reporting to the VP of Digital Workplace Solutions. You have been tasked with designing the ${taskName.toLowerCase()} for the xIQ platform deployment. Your work will directly influence how the team scales from 750 to 2,500+ locations.`,
    deliverables: [
      { id: 'd1', text: 'Every store incident type from the 6-week ticket data, classified by what xIQ handles autonomously vs. what requires human review' },
      { id: 'd2', text: 'The handoff sequence between xIQ, L1, L2, and store management' },
      { id: 'd3', text: 'Confidence routing thresholds per device category' },
      { id: 'd4', text: 'L1 team scalability analysis' },
      { id: 'd5', text: 'Conservative and aggressive expansion variants' },
      { id: 'd6', text: 'POS outage prevention measures' },
    ],
    resources: [
      { id: 'r1', name: 'NASA TLX Documentation', type: 'url', usage: 'Reference' },
      { id: 'r2', name: 'BPMN Human-Agentic Workflows', type: 'url', usage: 'Reference' },
      { id: 'r3', name: 'EU AI Act Article 14', type: 'url', usage: 'Reference' },
      ...(context.files || []).map((f, i) => ({
        id: `rf${i}`,
        name: typeof f === 'string' ? f : f.name,
        type: 'file',
        usage: 'Required',
      })),
    ],
  };
}

function EditableSection({ title, text, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => { setValue(text); }, [text]);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 1500);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: 6,
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: 'var(--brown-muted)',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <Pencil size={13} style={{ color: 'var(--brown-light)' }} />
          </button>
        )}
      </div>

      {editing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Escape') handleSave(); }}
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid rgba(139,105,20,0.3)',
            backgroundColor: 'rgba(139,105,20,0.03)',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--brown)',
            lineHeight: 1.7,
            minHeight: 120,
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown)',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: '4px 0',
          backgroundColor: highlighted ? 'rgba(139,105,20,0.08)' : 'transparent',
          transition: 'background-color 1.5s ease-out',
          borderRadius: 4,
        }}>
          {text}
        </p>
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
    }, 2000);
    return () => clearTimeout(timer);
  }, [task, context, role, selectedRole]);

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    const timer = setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: `I've updated the assessment environment based on your request: "${userMsg}". The changes have been applied.` },
      ]);
    }, 800);
    return () => clearTimeout(timer);
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
      resources: doc.resources.map((r) => r.name),
      chatHistory: chatMessages,
    });
    completeStep(3);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
      }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 16 }} />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--brown-muted)',
        }}>
          Generating assessment environment...
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--brown-light)',
          marginTop: 4,
        }}>
          This usually takes a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Title + subtitle */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--brown)',
          margin: '0 0 6px 0',
        }}>
          Configure Environment
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--brown-soft)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          Review and customize the assessment scenario
        </p>
      </div>

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
          Here's your Assessment Environment. You can edit any section directly, or tell me what to change in the chat below.
        </p>
      </div>

      {/* Document card */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-default)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
      }}>
        {/* Title */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: 'var(--gold)',
          marginBottom: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          ASSESSMENT ENVIRONMENT
        </div>

        {/* Metadata */}
        <div style={{ marginBottom: 20 }}>
          {[
            { label: 'Role', value: selectedRole.name || role.title },
            { label: 'Task', value: task.name },
            { label: 'Job', value: role.title },
          ].map((row) => (
            <div key={row.label} style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--brown-light)',
              marginBottom: 3,
            }}>
              {row.label}: {row.value}
            </div>
          ))}
        </div>

        {/* Editable sections */}
        <EditableSection
          title="Context"
          text={doc.contextText}
          onSave={(val) => setDoc({ ...doc, contextText: val })}
        />

        <EditableSection
          title="Your Role"
          text={doc.yourRoleText}
          onSave={(val) => setDoc({ ...doc, yourRoleText: val })}
        />

        {/* Deliverables */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: 6,
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: 'var(--brown-muted)',
              textTransform: 'uppercase',
            }}>
              Deliverables
            </span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Pencil size={13} style={{ color: 'var(--brown-light)' }} />
            </button>
          </div>
          <div>
            {doc.deliverables.map((d, i) => (
              <div key={d.id} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--brown)',
                lineHeight: 1.7,
                marginBottom: 4,
              }}>
                {String.fromCharCode(97 + i)}) {d.text}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: 6,
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: 'var(--brown-muted)',
              textTransform: 'uppercase',
            }}>
              Resources
            </span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Pencil size={13} style={{ color: 'var(--brown-light)' }} />
            </button>
          </div>
          <div>
            {doc.resources.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex',
                gap: 8,
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--brown)',
                padding: '4px 0',
                borderBottom: i < doc.resources.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: 'var(--brown-light)',
                  width: 20,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1 }}>{r.name}</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: 'var(--brown-light)',
                }}>
                  {r.type}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: 'var(--brown-light)',
                }}>
                  {r.usage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat messages */}
      {chatMessages.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                maxWidth: '85%',
                marginBottom: 6,
                marginLeft: msg.role === 'user' ? 'auto' : 0,
                backgroundColor: msg.role === 'user'
                  ? 'rgba(139,105,20,0.06)'
                  : 'var(--cream-row-even)',
                border: msg.role === 'user' ? '1px solid var(--border-light)' : 'none',
                animation: 'fsu .15s ease',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--brown)',
                margin: 0,
                lineHeight: 1.5,
              }}>{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chat input */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 14,
        border: '1px solid var(--border-default)',
        backgroundColor: '#fff',
        marginBottom: 20,
      }}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
          placeholder='Type a modification, e.g. "Add a deliverable about cost-benefit analysis"'
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--brown)',
            backgroundColor: 'transparent',
          }}
        />
        <button
          onClick={handleChatSend}
          disabled={!chatInput.trim()}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: chatInput.trim() ? 'var(--gold)' : 'var(--cream-row-even)',
            cursor: chatInput.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Send size={12} style={{ color: chatInput.trim() ? '#fff' : 'var(--brown-light)' }} />
        </button>
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Confirm Assessment Environment
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
