import { supabase } from '@/lib/supabase';

// Map DB row → app format
function toAppRole(row) {
  return {
    id: row.id,
    title: row.title,
    dept: row.department || 'Engineering',
    status: row.status || 'draft',
    salary: row.salary_range || '',
    jd: row.job_description || '',
    createdAt: row.created_at,
    isPrivate: false, // not in DB yet, default
    organizationId: row.organization_id,
  };
}

export async function fetchRoles(orgId) {
  if (!supabase || !orgId) return null;
  const { data, error } = await supabase
    .from('hiring_roles')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchRoles error:', error); return null; }
  return data.map(toAppRole);
}

export async function createRole(orgId, role, createdBy) {
  if (!supabase || !orgId) return null;
  const { data, error } = await supabase
    .from('hiring_roles')
    .insert({
      organization_id: orgId,
      title: role.title,
      department: role.dept || 'Engineering',
      status: role.status || 'draft',
      salary_range: role.salary || null,
      job_description: role.jd || null,
      created_by: createdBy || null,
    })
    .select()
    .single();
  if (error) { console.error('createRole error:', error); return null; }
  return toAppRole(data);
}

export async function updateRoleDb(roleId, updates) {
  if (!supabase || !roleId) return null;
  const dbUpdates = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.dept !== undefined) dbUpdates.department = updates.dept;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.salary !== undefined) dbUpdates.salary_range = updates.salary;
  if (updates.jd !== undefined) dbUpdates.job_description = updates.jd;

  const { data, error } = await supabase
    .from('hiring_roles')
    .update(dbUpdates)
    .eq('id', roleId)
    .select()
    .single();
  if (error) { console.error('updateRole error:', error); return null; }
  return toAppRole(data);
}

export async function deleteRoleDb(roleId) {
  if (!supabase || !roleId) return false;
  const { error } = await supabase
    .from('hiring_roles')
    .delete()
    .eq('id', roleId);
  if (error) { console.error('deleteRole error:', error); return false; }
  return true;
}

export async function duplicateRoleDb(roleId, orgId) {
  if (!supabase || !roleId) return null;
  const { data: original } = await supabase
    .from('hiring_roles')
    .select('*')
    .eq('id', roleId)
    .single();
  if (!original) return null;

  const { data, error } = await supabase
    .from('hiring_roles')
    .insert({
      organization_id: orgId,
      title: original.title + ' (Copy)',
      department: original.department,
      status: 'draft',
      salary_range: original.salary_range,
      job_description: original.job_description,
    })
    .select()
    .single();
  if (error) { console.error('duplicateRole error:', error); return null; }
  return toAppRole(data);
}
