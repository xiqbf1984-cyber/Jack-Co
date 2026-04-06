'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Briefcase, MoreVertical, CirclePlus, X, StopCircle, Copy, Lock, Archive, Trash2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { STATUS_MAP } from '@/lib/constants';

var STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

function StatusFilterDropdown({ selected, onChange }) {
  var [open, setOpen] = useState(false);
  var [filterSearch, setFilterSearch] = useState('');
  var ref = useRef(null);

  useEffect(function () {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return function () { document.removeEventListener('mousedown', handleClick); };
  }, []);

  var filtered = STATUS_OPTIONS.filter(function (s) {
    return s.label.toLowerCase().includes(filterSearch.toLowerCase());
  });

  function toggle(value) {
    if (selected.includes(value)) onChange(selected.filter(function (s) { return s !== value; }));
    else onChange(selected.concat([value]));
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={function () { setOpen(!open); }} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
        border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)',
        fontSize: 12, color: selected.length > 0 ? 'var(--brown)' : 'var(--brown-soft)', cursor: 'pointer',
      }}>
        <CirclePlus size={13} />Status
        {selected.length > 0 && <span style={{ marginLeft: 2, padding: '0 6px', borderRadius: 10, backgroundColor: 'var(--cream)', fontSize: 10, fontWeight: 600, color: 'var(--brown)' }}>{selected.length}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, width: 200, backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-dropdown)', zIndex: 20, overflow: 'hidden', animation: 'fsd 0.15s ease both' }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
              <input autoFocus type="text" value={filterSearch} onChange={function (e) { setFilterSearch(e.target.value); }} placeholder="Status"
                style={{ width: '100%', padding: '6px 8px 6px 26px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', background: 'transparent', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {filtered.map(function (opt) {
              var checked = selected.includes(opt.value);
              return (
                <button key={opt.value} onClick={function () { toggle(opt.value); }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', border: 'none', background: 'transparent',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.1s ease',
                }}
                  onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
                  onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <div style={{ width: 15, height: 15, borderRadius: 3, border: '1.5px solid ' + (checked ? 'var(--gold)' : 'var(--border-default)'), background: checked ? 'var(--gold)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleActions({ roleId }) {
  var [open, setOpen] = useState(false);
  var ref = useRef(null);
  useEffect(function () {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return function () { document.removeEventListener('mousedown', handleClick); };
  }, []);

  var items = [
    { icon: StopCircle, label: 'Stop Hiring', color: 'var(--brown)' },
    { icon: Copy, label: 'Copy Role', color: 'var(--brown)' },
    { icon: Lock, label: 'Make Private', color: 'var(--brown)' },
    { icon: Archive, label: 'Archive Role', color: 'var(--brown)' },
    { icon: Trash2, label: 'Delete Role', color: 'var(--red)' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={function (e) { e.stopPropagation(); setOpen(!open); }} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brown-light)', borderRadius: 4,
      }}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 160, backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-dropdown)', zIndex: 20, overflow: 'hidden', animation: 'fsd 0.12s ease both' }}>
          {items.map(function (item) {
            var Icon = item.icon;
            return (
              <button key={item.label} onClick={function () { setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', border: 'none', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: 12, color: item.color, cursor: 'pointer', textAlign: 'left',
              }}
                onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = item.color === 'var(--red)' ? 'rgba(192,57,43,0.05)' : 'var(--cream)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  var diff = Date.now() - new Date(dateStr).getTime();
  var mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + ' minutes ago';
  var hours = Math.floor(mins / 60);
  if (hours < 24) return hours + ' hours ago';
  var days = Math.floor(hours / 24);
  if (days < 30) return days + ' days ago';
  var months = Math.floor(days / 30);
  return months + ' months ago';
}

export default function RolesPage() {
  var roles = useAppStore(function (s) { return s.roles; });
  var [search, setSearch] = useState('');
  var [statusFilter, setStatusFilter] = useState([]);

  var filtered = useMemo(function () {
    var list = roles;
    if (statusFilter.length > 0) {
      list = list.filter(function (r) { return statusFilter.includes(r.status); });
    }
    if (search.trim()) {
      var q = search.toLowerCase();
      list = list.filter(function (r) { return r.title.toLowerCase().includes(q) || (r.dept || '').toLowerCase().includes(q); });
    }
    return list;
  }, [roles, search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>Roles</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>Manage your hiring roles and job descriptions</p>
        </div>
        <Link href="/roles/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 12 }}>
          <Plus size={13} /> Add Role
        </Link>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 240 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input type="text" value={search} onChange={function (e) { setSearch(e.target.value); }} placeholder="Search roles..."
            style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <StatusFilterDropdown selected={statusFilter} onChange={setStatusFilter} />
        {statusFilter.length > 0 && (
          <button onClick={function () { setStatusFilter([]); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 6, border: 'none', background: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', cursor: 'pointer' }}>
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden', background: '#fff' }}>
          {filtered.map(function (role, i) {
            var statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            var statusColor = 'var(--' + statusInfo.color + ')';

            return (
              <div key={role.id} style={{
                display: 'flex', alignItems: 'center', padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background-color 0.1s ease',
              }}
                onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {/* Icon */}
                <Briefcase size={14} style={{ color: 'var(--brown-light)', flexShrink: 0, marginRight: 14 }} />

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--brown)' }}>{role.title}</div>
                </div>

                {/* Owner badge */}
                <div style={{
                  padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border-default)',
                  fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)',
                  marginRight: 16, flexShrink: 0,
                }}>Owner</div>

                {/* Creator initials */}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #8b6914, #c4a332)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 700, color: '#fff' }}>KH</span>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 16, flexShrink: 0, minWidth: 70 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>{statusInfo.label}</span>
                </div>

                {/* Time ago */}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', marginRight: 12, flexShrink: 0, minWidth: 90, textAlign: 'right' }}>
                  {timeAgo(role.createdAt)}
                </span>

                {/* Actions */}
                <RoleActions roleId={role.id} />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            {search || statusFilter.length > 0 ? 'No roles match your filters' : 'No roles yet'}
          </p>
          {!search && statusFilter.length === 0 && (
            <Link href="/roles/create" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16, padding: '8px 18px', fontSize: 12, textDecoration: 'none' }}>
              Create your first role
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
