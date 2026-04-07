import { supabase } from '@/lib/supabase';

export async function fetchCandidates(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchCandidates error:', error); return null; }
  return data;
}

export async function createCandidate(userId, candidate) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('candidates')
    .insert({
      user_id: userId,
      name: candidate.name,
      email: candidate.email,
      status: candidate.status || 'idle',
      timezone: candidate.tz || '',
      notes: candidate.notes || '',
      avatar: candidate.avatar || '',
    })
    .select()
    .single();
  if (error) { console.error('createCandidate error:', error); return null; }
  return data;
}

export async function deleteCandidate(candidateId) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', candidateId);
  if (error) { console.error('deleteCandidate error:', error); return false; }
  return true;
}
