import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for server-side operations (bypasses RLS)
// Use anon key for client-side operations
export const supabase = supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : null;

// Helper: get user's numeric ID from clerk_id
export async function getUserByClerkId(clerkId) {
  if (!supabase || !clerkId) return null;
  const { data, error } = await supabase
    .from('users')
    .select('id, clerk_id, email, name, avatar_url')
    .eq('clerk_id', clerkId)
    .single();
  if (error) return null;
  return data;
}

// Helper: get user's organization_id
export async function getUserOrgId(userDbId) {
  if (!supabase || !userDbId) return null;
  const { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userDbId)
    .limit(1)
    .single();
  if (error) return null;
  return data?.organization_id || null;
}

// Combined: clerk_id → org_id (for convenience)
export async function getOrgIdFromClerk(clerkId) {
  const user = await getUserByClerkId(clerkId);
  if (!user) return null;
  return getUserOrgId(user.id);
}
