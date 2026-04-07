'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Briefcase, MoreVertical, CirclePlus, X, Eye, Copy, Lock, Unlock, Archive, ArchiveRestore, Trash2, AlertTriangle } from 'lucide-react';
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
        transition: 'border-color 0.15s ease',
      }}
        onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
        onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
      >
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

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)',
        zIndex: 100, backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 340, padding: '24px', backgroundColor: '#fff', borderRadius: 14,
        boxShadow: 'var(--shadow-modal)', zIndex: 101, animation: 'fadeScale .15s ease both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(192,57,43,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={16} style={{ color: 'var(--red)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--brown)' }}>
            Confirm Action
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', lineHeight: 1.5, marginBottom: 20 }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} className="btn-secondary" style={{ padding: '7px 16px', fontSize: 12 }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '7px 16px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600,
            border: 'none', borderRadius: 8, cursor: 'pointer',
            backgroundColor: 'var(--red)', color: '#fff',
          }}>Delete</button>
        </div>
      </div>
    </>
  );
}

function RoleActions({ role }) {
  var [open, setOpen] = useState(false);
  var [confirmDelete, setConfirmDelete] = useState(false);
  var ref = useRef(null);
  var removeRole = useAppStore(function (s) { return s.removeRole; });
  var updateRole = useAppStore(function (s) { return s.updateRole; });
  var duplicateRole = useAppStore(function (s) { return s.duplicateRole; });
  var addNotification = useAppStore(function (s) { return s.addNotification; });

  useEffect(function () {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return function () { document.removeEventListener('mousedown', handleClick); };
  }, []);

  var isActive = role.status === 'active';
  var isArchived = role.status === 'archived';
  var isPrivate = role.isPrivate || false;

  var router = useRouter();
  var items = [];

  // View Role
  items.push({
    icon: Eye, label: 'View Role', color: 'var(--brown)',
    action: function () { router.push('/roles/' + role.id); },
  });

  // Copy Role
  items.push({
    icon: Copy, label: 'Copy Role', color: 'var(--brown)',
    action: function () {
      duplicateRole(role.id);
      addNotification({ type: 'role', title: 'Role duplicated', message: role.title + ' (Copy) created' });
    },
  });

  // Make Private / Make Public
  items.push({
    icon: isPrivate ? Unlock : Lock,
    label: isPrivate ? 'Make Public' : 'Make Private',
    color: 'var(--brown)',
    action: function () {
      updateRole(role.id, { isPrivate: !isPrivate });
      addNotification({ type: 'role', title: isPrivate ? 'Role is now public' : 'Role is now private', message: role.title });
    },
  });

  // Archive / Unarchive
  if (isArchived) {
    items.push({
      icon: ArchiveRestore, label: 'Unarchive', color: 'var(--brown)',
      action: function () {
        updateRole(role.id, { status: 'draft' });
        addNotification({ type: 'role', title: 'Role unarchived', message: role.title + ' restored as draft' });
      },
    });
  } else {
    items.push({
      icon: Archive, label: 'Archive Role', color: 'var(--brown)',
      action: function () {
        updateRole(role.id, { status: 'archived' });
        addNotification({ type: 'role', title: 'Role archived', message: role.title + ' has been archived' });
      },
    });
  }

  // Delete
  items.push({
    icon: Trash2, label: 'Delete Role', color: 'var(--red)',
    action: function () { setConfirmDelete(true); },
  });

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={function (e) { e.stopPropagation(); setOpen(!open); }} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brown-light)', borderRadius: 4,
        transition: 'color 0.1s ease',
      }}
        onMouseEnter={function (e) { e.currentTarget.style.color = 'var(--brown)'; }}
        onMouseLeave={function (e) { e.currentTarget.style.color = 'var(--brown-light)'; }}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 170, backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-dropdown)', zIndex: 20, overflow: 'hidden', animation: 'fsd 0.12s ease both' }}>
          {items.map(function (item) {
            var Icon = item.icon;
            return (
              <button key={item.label} onClick={function () { item.action(); setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', border: 'none', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: 12, color: item.color, cursor: 'pointer', textAlign: 'left',
                transition: 'background-color 0.1s ease',
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
      {confirmDelete && (
        <ConfirmDialog
          message={'Are you sure you want to delete "' + role.title + '"? This action cannot be undone.'}
          onConfirm={function () {
            removeRole(role.id);
            addNotification({ type: 'role', title: 'Role deleted', message: role.title + ' has been removed' });
            setConfirmDelete(false);
            setOpen(false);
          }}
          onCancel={function () { setConfirmDelete(false); }}
        />
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
  var pageRouter = useRouter();
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
      <div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>Roles</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', marginTop: 4 }}>Manage your hiring roles and job descriptions</p>
      </div>

      {/* Search + Filter */}
      {roles.length > 0 && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 240 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brown-soft)' }} />
          <input type="text" value={search} onChange={function (e) { setSearch(e.target.value); }} placeholder="Search roles..."
            style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease' }}
            onFocus={function (e) { e.target.style.borderColor = 'var(--border-hover)'; }}
            onBlur={function (e) { e.target.style.borderColor = 'var(--border-default)'; }}
          />
        </div>
        <StatusFilterDropdown selected={statusFilter} onChange={setStatusFilter} />
        {statusFilter.length > 0 && (
          <button onClick={function () { setStatusFilter([]); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 6, border: 'none', background: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)', cursor: 'pointer' }}>
            <X size={10} /> Clear
          </button>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/roles/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 12 }}>
            Add Role
          </Link>
        </div>
      </div>
      )}

      {/* Empty state */}
      {roles.length === 0 && (
        <div style={{ borderRadius: 14, border: '1px solid var(--border-default)', background: '#fff', minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,105,20,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Briefcase size={20} style={{ color: 'var(--gold)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>No roles yet</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', maxWidth: 300, lineHeight: 1.5, textAlign: 'center', marginBottom: 20 }}>Create your first role to start building your hiring pipeline.</p>
          <Link href="/roles/create" className="btn-primary" style={{ padding: '9px 22px', fontSize: 13, textDecoration: 'none' }}>
            Create Role
          </Link>
        </div>
      )}

      {/* Table */}
      {roles.length > 0 && filtered.length > 0 && (
        <div style={{ borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'visible', background: '#fff' }}>
          {filtered.map(function (role, i) {
            var statusInfo = STATUS_MAP[role.status] || STATUS_MAP.draft;
            var statusColor = 'var(--' + statusInfo.color + ')';

            return (
              <div key={role.id} style={{
                display: 'flex', alignItems: 'center', padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer',
              }}
                onClick={function () { pageRouter.push('/roles/' + role.id); }}
                onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.015)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {/* Icon */}
                <Briefcase size={14} style={{ color: 'var(--brown-light)', flexShrink: 0, marginRight: 14 }} />

                {/* Title + private indicator */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--brown)' }}>{role.title}</div>
                  {role.isPrivate && (
                    <Lock size={11} style={{ color: 'var(--brown-light)', flexShrink: 0 }} />
                  )}
                </div>

                {/* Department */}
                {role.dept && (
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--brown-soft)',
                    padding: '2px 8px', borderRadius: 4, backgroundColor: 'var(--cream)',
                    marginRight: 12, flexShrink: 0,
                  }}>{role.dept}</span>
                )}

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
                <RoleActions role={role} />
              </div>
            );
          })}
        </div>
      )}
      {roles.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)' }}>
            No roles match your filters
          </p>
        </div>
      )}
    </div>
  );
}
