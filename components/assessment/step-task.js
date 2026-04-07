'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { TAXONOMY } from '@/lib/constants';
import { Search } from 'lucide-react';

function stripCodePrefix(name) {
  return name.replace(/^[A-Z]-[A-Z0-9]+\s*[-—–]\s*/, '');
}

export default function StepTask() {
  var selectedRole = useAssessmentStore(function (s) { return s.selectedRole; });
  var updateTask = useAssessmentStore(function (s) { return s.updateTask; });
  var completeStep = useAssessmentStore(function (s) { return s.completeStep; });
  var role = useAssessmentStore(function (s) { return s.role; });
  var selectedTask = useAssessmentStore(function (s) { return s.task; });
  var [search, setSearch] = useState('');
  var [hoveredTask, setHoveredTask] = useState(null);
  var [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  var hasJD = !!role.jd;
  var taskCategories = selectedRole.taskCategories || [];

  if (taskCategories.length === 0) {
    Object.values(TAXONOMY).forEach(function (cluster) {
      (cluster.pathways || []).forEach(function (pw) {
        (pw.roles || []).forEach(function (r) {
          (r.taskCategories || []).forEach(function (cat) {
            taskCategories = taskCategories.concat([cat]);
          });
        });
      });
    });
  }

  var allTasks = taskCategories.flatMap(function (cat) {
    return (cat.tasks || []).map(function (t) {
      return { ...t, categoryCode: cat.code, categoryName: cat.name, categoryId: cat.id };
    });
  });

  var recommended = hasJD ? allTasks.slice(0, 3) : [];
  var recommendedIds = new Set(recommended.map(function (t) { return t.id; }));
  var q = search.toLowerCase();

  var handleSelect = function (t) {
    updateTask({
      id: t.id, code: '', name: stripCodePrefix(t.name),
      categoryCode: t.categoryCode, categoryName: t.categoryName,
      aiDoes: t.aiDoes, humanDoes: t.humanDoes, produces: t.produces,
    });
    completeStep(1);
  };

  var filterTask = function (t) {
    if (!q) return true;
    return stripCodePrefix(t.name).toLowerCase().includes(q)
      || (t.aiDoes || '').toLowerCase().includes(q)
      || (t.produces || '').toLowerCase().includes(q);
  };

  // Group by category
  var grouped = {};
  allTasks.filter(filterTask).forEach(function (t) {
    // recommended tasks stay in their categories (badge shown on card)
    var key = t.categoryName || 'Other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  var selected = function (t) { return selectedTask && selectedTask.id === t.id; };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Select a Task
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Choose what the candidate will work on
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
        <input type="text" value={search} onChange={function (e) { setSearch(e.target.value); }}
          placeholder="Search tasks..."
          style={{
            width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
            borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* All tasks by category */}
      {Object.entries(grouped).map(function (entry) {
        var catName = entry[0]; var tasks = entry[1];
        return (
          <div key={catName} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {stripCodePrefix(catName)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {tasks.map(function (t) {
                return renderCompactCard(t, selected(t), handleSelect, setHoveredTask, function (e) { setTooltipPos({ x: e.clientX, y: e.clientY }); }, recommendedIds.has(t.id));
              })}
            </div>
          </div>
        );
      })}

      {/* Hover detail panel */}
      {hoveredTask && (
        <div style={{
          position: 'fixed',
          top: Math.min(tooltipPos.y + 12, typeof window !== 'undefined' ? window.innerHeight - 220 : 400),
          left: Math.min(tooltipPos.x + 12, typeof window !== 'undefined' ? window.innerWidth - 320 : 600),
          width: 280, backgroundColor: '#fff', borderRadius: 10,
          border: '1px solid var(--border-default)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          padding: '14px', zIndex: 50,
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)', marginBottom: 10 }}>
            {stripCodePrefix(hoveredTask.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'AI Does', text: hoveredTask.aiDoes },
              { label: 'Human Does', text: hoveredTask.humanDoes },
              { label: 'Produces', text: hoveredTask.produces },
            ].map(function (col) {
              return (
                <div key={col.label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 2 }}>{col.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.5 }}>{col.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function renderCompactCard(t, isSelected, onSelect, onHover, onMouseMove, isRecommended) {
  return (
    <button
      key={t.id}
      onClick={function () { onSelect(t); }}
      onMouseEnter={function (e) { onHover(t); if (onMouseMove) onMouseMove(e); }}
      onMouseMove={function (e) { if (onMouseMove) onMouseMove(e); }}
      onMouseLeave={function () { onHover(null); }}
      style={{
        padding: '12px 14px', borderRadius: 10,
        border: isSelected ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
        backgroundColor: isSelected ? 'rgba(139,105,20,0.04)' : '#fff',
        cursor: 'pointer', textAlign: 'left',
        transition: 'box-shadow 0.15s ease',
        position: 'relative',
      }}
      onMouseEnterCapture={function (e) { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'; }}
      onMouseLeaveCapture={function (e) { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {isRecommended && (
        <span style={{
          position: 'absolute', top: 6, right: 8,
          fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600,
          color: 'var(--gold)', backgroundColor: 'rgba(139,105,20,0.08)',
          padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>Recommended</span>
      )}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
        {stripCodePrefix(t.name)}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)', lineHeight: 1.4 }}>
        {t.produces}
      </div>
    </button>
  );
}
