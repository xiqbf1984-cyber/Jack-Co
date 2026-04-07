'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Briefcase } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

var avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

var TABS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  var diff = Date.now() - new Date(dateStr).getTime();
  var days = Math.floor(diff / 86400000);
  if (days === 0) return 'Created today';
  if (days === 1) return 'Created 1 day ago';
  return 'Created ' + days + ' days ago';
}

export default function AssessmentsPage() {
  var assessments = useAppStore(function (s) { return s.assessments; });
  var candidates = useAppStore(function (s) { return s.candidates; });
  var [search, setSearch] = useState('');
  var [activeTab, setActiveTab] = useState('all');

  var filtered = useMemo(function () {
    var list = assessments;
    if (activeTab !== 'all') {
      var statusMap = { draft: ['draft'], active: ['published', 'active', 'pending'], archived: ['expired', 'completed'] };
      var statuses = statusMap[activeTab] || [];
      list = list.filter(function (a) { return statuses.includes(a.status); });
    }
    if (search.trim()) {
      var q = search.toLowerCase();
      list = list.filter(function (a) { return a.name.toLowerCase().includes(q) || (a.roleTitle || '').toLowerCase().includes(q); });
    }
    return list;
  }, [assessments, search, activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>Assessments</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>Manage your candidate assessments</p>
      </div>

      {/* Search + Tab filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 220 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input type="text" value={search} onChange={function (e) { setSearch(e.target.value); }}
            placeholder="Search assessments..."
            style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease' }}
            onFocus={function (e) { e.currentTarget.style.borderColor = 'var(--brown-light)'; }}
            onBlur={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; }} />
        </div>
        <div style={{ display: 'flex', borderRadius: 8, border: '1px solid var(--border-default)', overflow: 'hidden', background: '#fff' }}>
          {TABS.map(function (tab) {
            return (
              <button key={tab.id} onClick={function () { setActiveTab(tab.id); }}
                style={{ padding: '7px 14px', border: 'none', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? 'var(--brown)' : 'var(--brown-soft)', backgroundColor: activeTab === tab.id ? 'var(--cream)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 12 }}>
            Create Assessment
          </Link>
        </div>
      </div>

      {/* Assessment cards */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          background: '#fff',
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'rgba(139,105,20,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Briefcase size={22} style={{ color: 'var(--gold)' }} />
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--brown)',
            marginBottom: 4,
          }}>
            {search || activeTab !== 'all' ? 'No assessments match your filters' : 'No assessments yet'}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--brown-soft)',
            maxWidth: 320,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {search || activeTab !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first assessment to start evaluating candidates with AI-powered work samples.'}
          </p>
          {!search && activeTab === 'all' && (
            <Link href="/assessment/create" className="btn-primary" style={{ display: 'inline-flex', padding: '8px 18px', fontSize: 12, textDecoration: 'none' }}>
              Create Assessment
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(function (assessment, i) {
            var statusInfo = STATUS_MAP[assessment.status] || STATUS_MAP.draft;
            var statusColor = 'var(--' + statusInfo.color + ')';
            var candCount = assessment.candIds?.length || 0;

            return (
              <Link href={'/assessment/' + assessment.id} key={assessment.id}
                style={{ display: 'block', padding: '16px 20px', borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', animation: 'fsu .2s ease ' + (i * 0.04) + 's both', textDecoration: 'none', transition: 'box-shadow 0.15s ease' }}
                onMouseEnter={function (e) { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.04)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown)' }}>{statusInfo.label}</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>{assessment.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>{timeAgo(assessment.createdAt)}</span>
                  {candCount > 0 && (
                    <div style={{ display: 'flex' }}>
                      {(assessment.candIds || []).slice(0, 3).map(function (candId, ci) {
                        var cand = candidates.find(function (c) { return c.id === candId; });
                        var initials = cand?.avatar || (cand?.name ? cand.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2) : '?');
                        return (
                          <div key={candId} style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: avatarColors[ci % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: ci > 0 ? -6 : 0, border: '2px solid #fff', zIndex: 3 - ci }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 600, color: '#fff' }}>{initials}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
          <div style={{ padding: '8px 0' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>Viewing <strong style={{ color: 'var(--brown)' }}>{filtered.length}</strong> rows</span>
          </div>
        </div>
      )}
    </div>
  );
}
