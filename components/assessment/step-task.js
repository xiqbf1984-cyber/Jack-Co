'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function StepTask() {
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const updateTask = useAssessmentStore((s) => s.updateTask);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;
  const taskCategories = selectedRole.taskCategories || [];
  const allTasks = taskCategories.flatMap((cat) =>
    (cat.tasks || []).map((t) => ({ ...t, categoryCode: cat.code, categoryName: cat.name, categoryId: cat.id }))
  );

  const recommended = hasJD ? allTasks.slice(0, 3) : [];

  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSelect = (t, catCode, catName) => {
    updateTask({
      id: t.id,
      code: t.code,
      name: t.name,
      categoryCode: catCode || t.categoryCode,
      categoryName: catName || t.categoryName,
      aiDoes: t.aiDoes,
      humanDoes: t.humanDoes,
      produces: t.produces,
    });
    completeStep(3);
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
          What type of task should this candidate perform? Here are the top recommendations based on your JD:
        </p>
      </div>

      {/* Recommended tasks */}
      {recommended.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {recommended.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t, t.categoryCode, t.categoryName)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '18px 20px',
                borderRadius: 14,
                border: i === 0
                  ? '1.5px solid rgba(139,105,20,0.3)'
                  : '1.5px solid var(--border-default)',
                backgroundColor: '#fff',
                cursor: 'pointer',
                marginBottom: 10,
                animation: `fsu .2s ease ${i * 0.05}s both`,
                transition: 'box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Star label for first */}
              {i === 0 && (
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  color: 'var(--gold)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  ★ RECOMMENDED
                </div>
              )}

              {/* Task name */}
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--brown)',
                fontWeight: 700,
                marginBottom: 8,
              }}>
                {t.code} — {t.name}
              </div>

              {/* Three-column grid: AI DOES / HUMAN DOES / PRODUCES */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                marginTop: 10,
              }}>
                {[
                  { label: 'AI DOES', text: t.aiDoes },
                  { label: 'HUMAN DOES', text: t.humanDoes },
                  { label: 'PRODUCES', text: t.produces },
                ].map((col) => (
                  <div key={col.label}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: 'var(--brown-light)',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                    }}>
                      {col.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--brown-muted)',
                      lineHeight: 1.4,
                    }}>
                      {col.text}
                    </div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Divider + full catalog */}
      <div style={{
        borderTop: '1px solid var(--border-light)',
        marginBottom: 16,
        paddingTop: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: 'var(--brown-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: 12,
        }}>
          ALL TASK CATEGORIES
        </div>
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {taskCategories.map((cat) => {
          const isExpanded = expandedCategories.includes(cat.id);
          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  backgroundColor: 'var(--cream-row-even)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {isExpanded
                  ? <ChevronDown size={12} style={{ color: 'var(--brown-soft)' }} />
                  : <ChevronRight size={12} style={{ color: 'var(--brown-soft)' }} />
                }
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--brown)',
                  flex: 1,
                }}>
                  {cat.code}: {cat.name}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: 'var(--brown-light)',
                }}>
                  {cat.tasks.length} task{cat.tasks.length !== 1 ? 's' : ''}
                </span>
              </button>

              {/* Expanded tasks */}
              {isExpanded && (
                <div style={{ animation: 'fsd .15s ease' }}>
                  {cat.tasks.map((t, ti) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelect(t, cat.code, cat.name)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px 10px 28px',
                        border: 'none',
                        borderBottom: ti < cat.tasks.length - 1 ? '1px solid var(--border-light)' : 'none',
                        background: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream-card)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: 'var(--brown-light)',
                        marginRight: 8,
                      }}>
                        {t.code}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: 'var(--brown)',
                      }}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
