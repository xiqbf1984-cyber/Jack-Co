'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
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

  var hasJD = !!role.jd;
  var taskCategories = selectedRole.taskCategories || [];
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
      id: t.id,
      code: t.code,
      name: t.name,
      categoryCode: t.categoryCode,
      categoryName: t.categoryName,
      aiDoes: t.aiDoes,
      humanDoes: t.humanDoes,
      produces: t.produces,
    });
    completeStep(3);
  };

  var isSelected = function (t) {
    return selectedTask && selectedTask.id === t.id;
  };

  var filterTask = function (t) {
    if (!q) return true;
    return stripCodePrefix(t.name).toLowerCase().includes(q)
      || (t.aiDoes && t.aiDoes.toLowerCase().includes(q))
      || (t.humanDoes && t.humanDoes.toLowerCase().includes(q))
      || (t.produces && t.produces.toLowerCase().includes(q));
  };

  if (taskCategories.length === 0) {
    return (
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
          Please go back and select a role first.
        </p>
      </div>
    );
  }

  var renderCard = function (t, i) {
    var selected = isSelected(t);
    return (
      <button
        key={t.id}
        onClick={function () { handleSelect(t); }}
        style={{
          padding: '14px 16px', borderRadius: 12,
          border: selected ? '1.5px solid var(--gold)' : '1px solid var(--border-default)',
          backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
          animation: 'fsu .2s ease ' + (i * 0.03) + 's both',
        }}
        onMouseEnter={function (e) { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
        onMouseLeave={function (e) { e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown)', fontWeight: 500 }}>
          {stripCodePrefix(t.name)}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10,
        }}>
          {[
            { label: 'AI DOES', text: t.aiDoes },
            { label: 'HUMAN DOES', text: t.humanDoes },
            { label: 'PRODUCES', text: t.produces },
          ].map(function (col) {
            return (
              <div key={col.label}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--brown-light)',
                  textTransform: 'uppercase', marginBottom: 3,
                }}>
                  {col.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)',
                  lineHeight: 1.4,
                }}>
                  {col.text}
                </div>
              </div>
            );
          })}
        </div>
      </button>
    );
  };

  var filteredRecommended = recommended.filter(filterTask);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
          Select a Task
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', margin: 0 }}>
          Choose what the candidate will work on
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
        <input
          type="text" value={search} onChange={function (e) { setSearch(e.target.value); }}
          placeholder="Search tasks..."
          style={{
            width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
            borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Recommended */}
      {filteredRecommended.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            color: 'var(--brown-light)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: 10,
          }}>
            RECOMMENDED
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {filteredRecommended.map(function (t, i) { return renderCard(t, i); })}
          </div>
        </div>
      )}

      {/* All Tasks grouped by category */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        color: 'var(--brown-light)', textTransform: 'uppercase',
        letterSpacing: '0.06em', marginBottom: 10,
      }}>
        ALL TASKS
      </div>

      {taskCategories.map(function (cat) {
        var tasks = (cat.tasks || []).filter(function (t) {
          if (recommendedIds.has(t.id) && !q) return false;
          return filterTask(t);
        });
        if (tasks.length === 0) return null;

        return (
          <div key={cat.id} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              color: 'var(--brown)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 10,
            }}>
              {stripCodePrefix(cat.name)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {tasks.map(function (t, i) {
                return renderCard({ ...t, categoryCode: cat.code, categoryName: cat.name }, i);
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
