'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { GRADE_SCALE } from '@/lib/constants';
import { ArrowLeft, Settings, Users, FileText } from 'lucide-react';

function getGrade(score) {
  for (const [letter, range] of Object.entries(GRADE_SCALE)) {
    if (score >= range.min && score <= range.max) return { letter, color: range.color };
  }
  return { letter: 'F', color: '#c0392b' };
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const challenges = useAppStore((s) => s.challenges);
  const candidates = useAppStore((s) => s.candidates);
  const challenge = challenges.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!challenge) {
    return (
      <div className="animate-fade-scale" style={{ padding: 'var(--page-padding-y) var(--page-padding-x)' }}>
        <Link href="/assessment" className="text-body-xs flex items-center gap-1 mb-4 no-underline" style={{ color: 'var(--gold)' }}>
          <ArrowLeft size={14} /> Back to Assessment
        </Link>
        <p className="text-body-sm" style={{ color: 'var(--brown-soft)' }}>Assessment not found.</p>
      </div>
    );
  }

  const statusColors = { published: '#27825b', submitted: '#0077B5', pending: '#d4880f', draft: '#c4b896' };

  return (
    <div className="animate-fade-scale" style={{ padding: 'var(--page-padding-y) var(--page-padding-x)' }}>
      <Link href="/assessment" className="text-body-xs flex items-center gap-1 mb-4 no-underline hover:underline" style={{ color: 'var(--gold)' }}>
        <ArrowLeft size={14} /> Back to Assessment
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-display-page">{challenge.name}</h1>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: (statusColors[challenge.status] || '#c4b896') + '14' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[challenge.status] }} />
          <span className="text-mono-tag" style={{ color: statusColors[challenge.status] }}>{challenge.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-body-sm border-none bg-transparent cursor-pointer transition-all"
              style={{
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--brown-soft)',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontFamily: 'var(--font-body)',
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fsu">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div><span className="text-mono-label block mb-1">Role</span><span className="text-body-sm">{challenge.roleTitle}</span></div>
              <div><span className="text-mono-label block mb-1">Skill</span><span className="text-body-sm">{challenge.skill}</span></div>
              <div><span className="text-mono-label block mb-1">Task</span><span className="text-body-sm">{challenge.task}</span></div>
              <div><span className="text-mono-label block mb-1">Candidates</span><span className="text-body-sm">{challenge.candIds?.length || 0}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div className="space-y-3 animate-fsu">
          {(challenge.results || []).map((result) => {
            const cand = candidates.find((c) => c.id === result.candId);
            const grade = getGrade(result.score);
            return (
              <div key={result.candId} className="rounded-xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold" style={{ background: 'linear-gradient(135deg, rgba(139,105,20,0.22), rgba(92,82,72,0.22))', color: 'var(--brown)' }}>
                  {cand?.avatar || '??'}
                </div>
                <div className="flex-1">
                  <div className="text-body-sm font-semibold" style={{ color: 'var(--brown)' }}>{cand?.name || 'Unknown'}</div>
                  <div className="text-body-xs">{cand?.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--cream-row-even)' }}>
                    <div className="h-full rounded-full" style={{ width: `${result.score}%`, backgroundColor: grade.color }} />
                  </div>
                  <span className="text-mono-data" style={{ color: 'var(--brown)' }}>{result.score}</span>
                  <span className="text-mono-data font-bold" style={{ color: grade.color }}>{grade.letter}</span>
                </div>
              </div>
            );
          })}
          {(!challenge.results || challenge.results.length === 0) && (
            <p className="text-body-xs text-center py-8" style={{ color: 'var(--brown-soft)' }}>No submissions yet.</p>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="animate-fsu">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--cream-card)', borderColor: 'var(--border-default)' }}>
            <h3 className="text-display-section mb-4">Assessment Settings</h3>
            <p className="text-body-xs mb-6">Manage this assessment's configuration.</p>
            <div className="border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
              <h4 className="text-body-sm font-semibold mb-2" style={{ color: 'var(--red)' }}>Danger Zone</h4>
              <button
                className="px-4 py-2 rounded-lg border text-body-sm font-semibold cursor-pointer transition-all font-body"
                style={{ borderColor: 'var(--red)', color: 'var(--red)', backgroundColor: 'transparent' }}
              >
                Delete Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
