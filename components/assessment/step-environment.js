'use client';

import { useState, useEffect, useRef } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Loader2, ArrowRight, Download } from 'lucide-react';

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
      { id: 'r1', name: 'xIQ Platform Architecture Overview', type: 'PDF', description: 'Complete technical architecture documentation for the xIQ Digital Workplace Platform, including integration points and API specifications.' },
      { id: 'r2', name: 'Incident Ticket Export (6 weeks)', type: 'CSV', description: 'Raw ticket data from the 750-location pilot covering all device categories, resolution times, and escalation paths.' },
      { id: 'r3', name: 'Deployment Runbook', type: 'MD', description: 'Step-by-step deployment procedures, rollback plans, and environment configuration for the xIQ platform.' },
      { id: 'r4', name: 'Store Network Topology Pack', type: 'ZIP', description: 'Network diagrams, device inventories, and connectivity specs for all 750 pilot locations.' },
      ...(context.files || []).map((f, i) => ({
        id: `rf${i}`,
        name: typeof f === 'string' ? f : f.name,
        type: 'PDF',
        description: 'Uploaded context file for the assessment.',
      })),
      { id: 'r5', name: 'NASA TLX Documentation', type: 'URL', description: 'Task Load Index methodology for measuring and conducting subjective workload assessments.' },
      { id: 'r6', name: 'BPMN Human-Agentic Workflows', type: 'URL', description: 'Business Process Model and Notation standards for designing human-AI collaborative workflows.' },
      { id: 'r7', name: 'EU AI Act Article 14', type: 'URL', description: 'European Union regulation on human oversight requirements for high-risk AI systems.' },
    ],
  };
}

const cardStyle = {
  borderRadius: 12,
  border: '1px solid var(--border-default)',
  background: '#fff',
  padding: '20px 24px',
  marginBottom: 16,
};

const sectionTitleStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--brown)',
  margin: '0 0 12px 0',
};

const badgeColors = {
  PDF: { bg: 'var(--brown)', color: '#fff' },
  ZIP: { bg: 'var(--brown)', color: '#fff' },
  MD: { bg: 'var(--brown-soft)', color: '#fff' },
  CSV: { bg: 'var(--accent-green)', color: '#fff' },
  URL: { bg: '#a3b18a', color: '#fff' },
};

function TypeBadge({ type }) {
  const colors = badgeColors[type] || badgeColors.PDF;
  return (
    <span style={{
      fontSize: 9,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 4,
      background: colors.bg,
      color: colors.color,
      flexShrink: 0,
      letterSpacing: '0.3px',
    }}>
      {type}
    </span>
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

  // Refs for contentEditable elements
  const contextRef = useRef(null);
  const roleRef = useRef(null);
  const deliverableRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = generateMockDocument(task, context, role, selectedRole);
      setDoc(generated);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [task, context, role, selectedRole]);

  const handleConfirm = () => {
    if (!doc) return;

    const currentContext = contextRef.current ? contextRef.current.innerText : doc.contextText;
    const currentRole = roleRef.current ? roleRef.current.innerText : doc.yourRoleText;
    const currentDeliverables = deliverableRefs.current.map((ref, i) =>
      ref ? ref.innerText : doc.deliverables[i].text
    );

    updateEnvironment({
      role: selectedRole.name || role.title,
      taskType: task.name,
      jobTitle: role.title,
      contextText: currentContext,
      yourRoleText: currentRole,
      deliverables: currentDeliverables,
      resources: doc.resources.map((r) => r.name),
      chatHistory: [],
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

  const fileResources = doc.resources.filter((r) => r.type !== 'URL');
  const urlResources = doc.resources.filter((r) => r.type === 'URL');

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
          Assessment Environment
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

      {/* Header Block */}
      <div style={cardStyle}>
        {[
          { label: 'Role', value: selectedRole.name || role.title },
          { label: 'Task', value: task.name },
          { label: 'Task Type', value: task.category || task.name },
        ].map((row, i) => (
          <div key={row.label} style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: i < 2 ? 8 : 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              flexShrink: 0,
              minWidth: 70,
              fontWeight: 600,
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--brown)',
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Context Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Context</h3>
        <p
          ref={contextRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown)',
            lineHeight: 1.7,
            margin: 0,
            outline: 'none',
            cursor: 'text',
            borderRadius: 6,
            padding: '4px 2px',
          }}
        >
          {doc.contextText}
        </p>
      </div>

      {/* Your Role Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Your Role</h3>
        <p
          ref={roleRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown)',
            lineHeight: 1.7,
            margin: 0,
            outline: 'none',
            cursor: 'text',
            borderRadius: 6,
            padding: '4px 2px',
          }}
        >
          {doc.yourRoleText}
        </p>
      </div>

      {/* Deliverables Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Deliverables</h3>
        <div>
          {doc.deliverables.map((d, i) => (
            <div key={d.id} style={{
              display: 'flex',
              gap: 8,
              marginBottom: i < doc.deliverables.length - 1 ? 6 : 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                lineHeight: 1.7,
                flexShrink: 0,
                fontWeight: 600,
              }}>
                {i + 1}.
              </span>
              <span
                ref={(el) => { deliverableRefs.current[i] = el; }}
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--brown)',
                  lineHeight: 1.7,
                  outline: 'none',
                  cursor: 'text',
                  flex: 1,
                }}
              >
                {d.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Resources / Attachments Section */}
      <div style={cardStyle}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Attachments</h3>
          <button style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 600,
            color: '#fff',
            background: 'var(--brown)',
            border: 'none',
            borderRadius: 6,
            padding: '5px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          }}>
            <Download size={11} />
            Download All
          </button>
        </div>

        {/* File resources */}
        {fileResources.map((r, i) => (
          <div key={r.id} style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            padding: '10px 0',
            borderBottom: i < fileResources.length - 1 ? '1px solid var(--border-default)' : 'none',
          }}>
            <TypeBadge type={r.type} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--brown)',
                marginBottom: 3,
              }}>
                {r.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--brown-soft)',
                lineHeight: 1.5,
              }}>
                {r.description}
              </div>
            </div>
          </div>
        ))}

        {/* Reference Links header */}
        {urlResources.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--brown-soft)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: 20,
              marginBottom: 10,
              paddingBottom: 6,
              borderBottom: '1px solid var(--border-default)',
            }}>
              Reference Links
            </div>

            {urlResources.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: i < urlResources.length - 1 ? '1px solid var(--border-default)' : 'none',
              }}>
                <TypeBadge type="URL" />
                <div style={{ flex: 1 }}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--gold)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline-block',
                      marginBottom: 3,
                    }}
                  >
                    {r.name}
                  </a>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--brown-soft)',
                    lineHeight: 1.5,
                  }}>
                    {r.description}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Continue button */}
      <button
        onClick={handleConfirm}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Continue
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
