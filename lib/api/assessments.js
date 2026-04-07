import { supabase } from '@/lib/supabase';

export async function fetchAssessments(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('assessments')
    .select('*, assessment_results(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchAssessments error:', error); return null; }
  return data;
}

export async function createAssessment(userId, assessment) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      name: assessment.name,
      role_id: assessment.roleId || null,
      role_title: assessment.roleTitle || '',
      status: assessment.status || 'draft',
      skill: assessment.skill || '',
      task: assessment.task || '',
    })
    .select()
    .single();
  if (error) { console.error('createAssessment error:', error); return null; }
  return data;
}

export async function deleteAssessment(assessmentId) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', assessmentId);
  if (error) { console.error('deleteAssessment error:', error); return false; }
  return true;
}
