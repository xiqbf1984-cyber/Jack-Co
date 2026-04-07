import { supabase } from '@/lib/supabase';

// Map DB row → app format
function toAppCandidate(row) {
  const initials = row.name
    ? row.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    status: row.status || 'idle',
    tz: '',
    joined: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    avatar: initials,
    assessments: 0,
    lastActive: row.updated_at
      ? formatTimeAgo(row.updated_at)
      : '\u2014',
    notes: row.notes || '',
    roleId: row.role_id,
    organizationId: row.organization_id,
  };
}

function formatTimeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + ' min ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  return days + 'd ago';
}

export async function fetchCandidates(orgId) {
  if (!supabase || !orgId) return null;
  const { data, error } = await supabase
    .from('hiring_candidates')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchCandidates error:', error); return null; }
  return data.map(toAppCandidate);
}

export async function createCandidateDb(orgId, candidate) {
  if (!supabase || !orgId) return null;
  const { data, error } = await supabase
    .from('hiring_candidates')
    .insert({
      organization_id: orgId,
      name: candidate.name,
      email: candidate.email,
      status: candidate.status || 'idle',
      notes: candidate.notes || null,
      role_id: candidate.roleId || null,
    })
    .select()
    .single();
  if (error) { console.error('createCandidate error:', error); return null; }
  return toAppCandidate(data);
}

export async function deleteCandidateDb(candidateId) {
  if (!supabase || !candidateId) return false;
  const { error } = await supabase
    .from('hiring_candidates')
    .delete()
    .eq('id', candidateId);
  if (error) { console.error('deleteCandidate error:', error); return false; }
  return true;
}
