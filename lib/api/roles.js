import { supabase } from '@/lib/supabase';

export async function fetchRoles(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchRoles error:', error); return null; }
  return data;
}

export async function createRole(userId, role) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('roles')
    .insert({
      user_id: userId,
      title: role.title,
      dept: role.dept || 'Engineering',
      status: role.status || 'draft',
      salary: role.salary || '',
      is_private: role.isPrivate || false,
      jd: role.jd || '',
      sharable_link: role.sharableLink || '',
    })
    .select()
    .single();
  if (error) { console.error('createRole error:', error); return null; }
  return data;
}

export async function updateRole(roleId, updates) {
  if (!supabase) return null;
  const dbUpdates = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.dept !== undefined) dbUpdates.dept = updates.dept;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.salary !== undefined) dbUpdates.salary = updates.salary;
  if (updates.isPrivate !== undefined) dbUpdates.is_private = updates.isPrivate;
  if (updates.jd !== undefined) dbUpdates.jd = updates.jd;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('roles')
    .update(dbUpdates)
    .eq('id', roleId)
    .select()
    .single();
  if (error) { console.error('updateRole error:', error); return null; }
  return data;
}

export async function deleteRole(roleId) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId);
  if (error) { console.error('deleteRole error:', error); return false; }
  return true;
}

export async function duplicateRole(roleId, userId) {
  if (!supabase) return null;
  const { data: original } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single();
  if (!original) return null;

  const { data, error } = await supabase
    .from('roles')
    .insert({
      user_id: userId,
      title: original.title + ' (Copy)',
      dept: original.dept,
      status: 'draft',
      salary: original.salary,
      is_private: original.is_private,
      jd: original.jd,
      sharable_link: 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10),
    })
    .select()
    .single();
  if (error) { console.error('duplicateRole error:', error); return null; }
  return data;
}
