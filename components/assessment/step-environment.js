'use client';

import { useState, useEffect, useRef } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { Loader2, ArrowRight, Download, Plus, Trash2 } from 'lucide-react';

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
      { id: 'r1', name: 'xIQ Platform Architecture Overview', type: 'PDF', description: 'Complete technical architecture documentation for the xIQ Digital Workplace Platform.' },
      { id: 'r2', name: 'Incident Ticket Export (6 weeks)', type: 'CSV', description: 'Raw ticket data from the 750-location pilot covering all device categories.' },
      { id: 'r3', name: 'Deployment Runbook', type: 'MD', description: 'Step-by-step deployment procedures and rollback plans.' },
      { id: 'r4', name: 'Store Network Topology Pack', type: 'ZIP', description: 'Network diagrams and device inventories for all 750 pilot locations.' },
      ...(context.files || []).map((f, i) => ({
        id: `rf${i}`,
        name: typeof f === 'string' ? f : f.name,
        type: 'PDF',
        description: 'Uploaded context file.',
      })),
      { id: 'r5', name: 'NASA TLX Documentation', type: 'URL', description: 'Task Load Index methodology for workload assessments.' },
      { id: 'r6', name: 'BPMN Human-Agentic Workflows', type: 'URL', description: 'BPMN standards for human-AI collaborative workflows.' },
      { id: 'r7', name: 'EU AI Act Article 14', type: 'URL', description: 'EU regulation on human oversight for high-risk AI systems.' },
    ],
  };
}

var badgeColors = {
  PDF: { bg: 'var(--brown)', color: '#fff' },
  ZIP: { bg: 'var(--brown)', color: '#fff' },
  MD: { bg: 'var(--brown-soft)', color: '#fff' },
  CSV: { bg: 'var(--accent-green)', color: '#fff' },
  URL: { bg: '#a3b18a', color: '#fff' },
};

function TypeBadge({ type }) {
  var colors = badgeColors[type] || badgeColors.PDF;
  return (
    <span style={{
      fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
      textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
      background: colors.bg, color: colors.color, flexShrink: 0, letterSpacing: '0.3px',
    }}>
      {type}
    </span>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
        color: 'var(--brown)', margin: '0 0 3px 0',
      }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)',
          margin: 0, lineHeight: 1.4,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

var cardStyle = {
  borderRadius: 12,
  border: '1px solid var(--border-default)',
  background: '#fff',
  padding: '16px 20px',
  marginBottom: 24,
};

var editableStyle = {
  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)',
  lineHeight: 1.7, margin: 0, outline: 'none', cursor: 'text',
  borderRadius: 6, padding: '4px 2px',
};

export default function StepEnvironment() {
  var task = useAssessmentStore(function (s) { return s.task; });
  var context = useAssessmentStore(function (s) { return s.context; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var selectedRole = useAssessmentStore(function (s) { return s.selectedRole; });
  var updateEnvironment = useAssessmentStore(function (s) { return s.updateEnvironment; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });

  var [loading, setLoading] = useState(true);
  var [doc, setDoc] = useState(null);

  var contextRef = useRef(null);
  var roleRef = useRef(null);
  var deliverableRefs = useRef([]);

  useEffect(function () {
    var timer = setTimeout(function () {
      var generated = generateMockDocument(task, context, role, selectedRole);
      setDoc(generated);
      setLoading(false);
    }, 2000);
    return function () { clearTimeout(timer); };
  }, [task, context, role, selectedRole]);

  var handleConfirm = function () {
    if (!doc) return;
    var currentContext = contextRef.current ? contextRef.current.innerText : doc.contextText;
    var currentRole = roleRef.current ? roleRef.current.innerText : doc.yourRoleText;
    var currentDeliverables = deliverableRefs.current.map(function (ref, i) {
      return ref ? ref.innerText : doc.deliverables[i].text;
    });
    updateEnvironment({
      role: selectedRole.name || role.title,
      taskType: task.name,
      jobTitle: role.title,
      contextText: currentContext,
      yourRoleText: currentRole,
      deliverables: currentDeliverables,
      resources: doc.resources.map(function (r) { return r.name; }),
      chatHistory: [],
    });
    completeStep(3);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 16 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-muted)' }}>
          Generating assessment environment...
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-light)', marginTop: 4 }}>
          This usually takes a few seconds.
        </p>
      </div>
    );
  }

  var fileResources = doc.resources.filter(function (r) { return r.type !== 'URL'; });
  var urlResources = doc.resources.filter(function (r) { return r.type === 'URL'; });

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: '0 0 4px 0' }}>
          Assessment Environment
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Review and customize the assessment scenario
        </p>
      </div>

      {/* Metadata row — compact, not a card */}
      <div style={{
        display: 'flex', gap: 24, padding: '10px 16px', borderRadius: 8,
        backgroundColor: 'rgba(139,105,20,0.03)', border: '1px solid var(--border-light)',
        marginBottom: 24,
      }}>
        {[
          { label: 'Role', value: selectedRole.name || role.title },
          { label: 'Task', value: task.name },
          { label: 'Task Type', value: task.category || task.name },
        ].map(function (row) {
          return (
            <div key={row.label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 2 }}>
                {row.label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)' }}>
                {row.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Context */}
      <SectionHeader title="Context" subtitle="Background scenario provided to the candidate" />
      <div style={cardStyle}>
        <p ref={contextRef} contentEditable suppressContentEditableWarning style={editableStyle}>
          {doc.contextText}
        </p>
      </div>

      {/* Your Role */}
      <SectionHeader title="Your Role" subtitle="What the candidate will be acting as" />
      <div style={cardStyle}>
        <p ref={roleRef} contentEditable suppressContentEditableWarning style={editableStyle}>
          {doc.yourRoleText}
        </p>
      </div>

      {/* Deliverables */}
      <SectionHeader title="Deliverables" subtitle="What the candidate must produce" />
      <div style={cardStyle}>
        {doc.deliverables.map(function (d, i) {
          return (
            <div key={d.id} style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '8px 0',
              borderBottom: i < doc.deliverables.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brown-light)', flexShrink: 0, minWidth: 20, paddingTop: 2 }}>
                {i + 1}.
              </span>
              <span
                ref={function (el) { deliverableRefs.current[i] = el; }}
                contentEditable suppressContentEditableWarning
                style={{ ...editableStyle, flex: 1, lineHeight: 1.6 }}
              >
                {d.text}
              </span>
              <button onClick={function () { setDoc(function (prev) { return { ...prev, deliverables: prev.deliverables.filter(function (_, j) { return j !== i; }) }; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, color: 'var(--brown-light)', marginTop: 2 }}>
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
        <button onClick={function () { setDoc(function (prev) { return { ...prev, deliverables: prev.deliverables.concat([{ id: 'new-' + Date.now(), text: 'New deliverable' }]) }; }); }} style={{
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 8,
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
        }}>
          <Plus size={12} /> Add deliverable
        </button>
      </div>

      {/* Attachments */}
      <SectionHeader title="Attachments" subtitle="Files and references provided to the candidate" />
      <div style={cardStyle}>
        {/* Download all */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: '#fff',
            background: 'var(--brown)', border: 'none', borderRadius: 6,
            padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            textTransform: 'uppercase', letterSpacing: '0.3px',
          }}>
            <Download size={10} /> Download All
          </button>
        </div>

        {/* File resources */}
        {fileResources.map(function (r, i) {
          return (
            <div key={r.id} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0',
              borderBottom: i < fileResources.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}>
              <TypeBadge type={r.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', marginBottom: 2 }}>
                  {r.name}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.4 }}>
                  {r.description}
                </div>
              </div>
              <button onClick={function () { setDoc(function (prev) { return { ...prev, resources: prev.resources.filter(function (x) { return x.id !== r.id; }) }; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, color: 'var(--brown-light)' }}>
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}

        {/* Reference Links */}
        {urlResources.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--brown-soft)',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 16, marginBottom: 8,
              paddingBottom: 6, borderBottom: '1px solid var(--border-light)',
            }}>
              Reference Links
            </div>
            {urlResources.map(function (r, i) {
              return (
                <div key={r.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0',
                  borderBottom: i < urlResources.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}>
                  <TypeBadge type="URL" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a href="#" onClick={function (e) { e.preventDefault(); }} style={{
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--gold)',
                      textDecoration: 'underline', cursor: 'pointer', display: 'inline-block', marginBottom: 2,
                    }}>
                      {r.name}
                    </a>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.4 }}>
                      {r.description}
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, color: 'var(--brown-light)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </>
        )}

        <button onClick={function () { setDoc(function (prev) { return { ...prev, resources: prev.resources.concat([{ id: 'new-' + Date.now(), name: 'New Resource', type: 'PDF', description: 'Description' }]) }; }); }} style={{
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 12,
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--gold)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
        }}>
          <Plus size={12} /> Add resource
        </button>
      </div>

      {/* Continue */}
      <button onClick={handleConfirm} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        Continue <ArrowRight size={14} />
      </button>
    </div>
  );
}
