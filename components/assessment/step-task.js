'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Star, Zap, User, FileOutput } from 'lucide-react';

export default function StepTask() {
  const selectedRole = useAssessmentStore((s) => s.selectedRole);
  const updateTask = useAssessmentStore((s) => s.updateTask);
  const completeStep = useAssessmentStore((s) => s.completeStep);
  const task = useAssessmentStore((s) => s.task);
  const role = useAssessmentStore((s) => s.role);

  const hasJD = !!role.jd;
  const taskCategories = selectedRole.taskCategories || [];
  const allTasks = taskCategories.flatMap((cat) =>
    (cat.tasks || []).map((t) => ({ ...t, categoryCode: cat.code, categoryName: cat.name, categoryId: cat.id }))
  );

  // Top 3 recommended tasks
  const recommended = hasJD ? allTasks.slice(0, 3) : [];

  const [expandedCategories, setExpandedCategories] = useState(
    taskCategories.length > 0 ? [taskCategories[0].id] : []
  );

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
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-display-page mb-2">What type of task should this candidate perform?</h1>
        <p className="text-body-lg">
          Please go back and select a role first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-display-page mb-2">What type of task should this candidate perform?</h1>
      <p className="text-body-lg mb-6">
        Choose a task for the <strong style={{ color: 'var(--gold)' }}>{selectedRole.name}</strong> assessment.
      </p>

      {/* Recommended section */}
      {recommended.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} style={{ color: 'var(--gold)' }} />
            <span className="text-mono-label" style={{ color: 'var(--gold)' }}>
              RECOMMENDED BASED ON YOUR JD
            </span>
          </div>
          <div className="space-y-2">
            {recommended.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                isSelected={task.id === t.id}
                isRecommended
                onSelect={() => handleSelect(t, t.categoryCode, t.categoryName)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full catalog */}
      <div>
        <span className="text-mono-label mb-3 block">FULL TASK CATALOG</span>
        <div className="space-y-2">
          {taskCategories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--cream-card)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-150 hover:bg-[var(--cream)]"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown size={14} style={{ color: 'var(--brown-soft)' }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: 'var(--brown-soft)' }} />
                    )}
                    <span
                      className="text-mono-tag px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--cream-row-even)', color: 'var(--brown)' }}
                    >
                      {cat.code}
                    </span>
                    <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-body-xs">
                    {cat.tasks.length} task{cat.tasks.length !== 1 ? 's' : ''}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 space-y-2 animate-fsd">
                    {cat.tasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        isSelected={task.id === t.id}
                        onSelect={() => handleSelect(t, cat.code, cat.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, isSelected, isRecommended, onSelect }) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all duration-200',
        'hover:shadow-sm'
      )}
      style={{
        border: isSelected
          ? '2px solid var(--accent-green)'
          : isRecommended
            ? '1.5px solid var(--gold-light)'
            : '1px solid var(--border-default)',
        backgroundColor: isSelected
          ? 'rgba(39,130,91,0.04)'
          : 'var(--cream)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-mono-tag px-1.5 py-0.5 rounded font-semibold"
              style={{ backgroundColor: 'var(--cream-row-even)', color: 'var(--brown)' }}
            >
              {task.code}
            </span>
            <span className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>
              {task.name}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 mt-2">
            <div className="flex items-start gap-2">
              <Zap size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
              <span className="text-body-xs">
                <strong>AI does:</strong> {task.aiDoes}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <User size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--blue)' }} />
              <span className="text-body-xs">
                <strong>Human does:</strong> {task.humanDoes}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FileOutput size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-green)' }} />
              <span className="text-body-xs">
                <strong>Output:</strong> {task.produces}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSelect}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-md text-body-xs font-semibold transition-all duration-200',
            isSelected ? 'btn-primary' : 'btn-secondary'
          )}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}
