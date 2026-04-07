import { supabase } from '@/lib/supabase';

// Assessments use the `challenges` table in this DB
// Map DB row → app format
function toAppAssessment(row) {
  return {
    id: row.id,
    name: row.title || '',
    roleTitle: row.source_position || '',
    status: row.status || 'draft',
    skill: '',
    task: row.primary_deliverable || '',
    createdAt: row.created_at,
    candIds: [],
    results: [],
  };
}

export async function fetchAssessments(hostId) {
  if (!supabase || !hostId) return null;
  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, status, created_at, source_position, primary_deliverable, host_id')
    .eq('host_id', hostId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.error('fetchAssessments error:', error); return null; }
  return data.map(toAppAssessment);
}
