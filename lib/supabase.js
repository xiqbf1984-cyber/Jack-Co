import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-safe Supabase instance — uses anon key only
// Service role key is ONLY used in server-side route handlers
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-only client with service role (for webhooks, admin operations)
export function getServiceClient() {
  var serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey);
}

// Helper: get user's numeric ID from clerk_id
export async function getUserByClerkId(clerkId) {
  if (!supabase || !clerkId) return null;
  var { data, error } = await supabase
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
  var { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userDbId)
    .limit(1)
    .single();
  if (error) return null;
  return data?.organization_id || null;
}

// Combined: clerk_id → org_id
export async function getOrgIdFromClerk(clerkId) {
  var user = await getUserByClerkId(clerkId);
  if (!user) return null;
  return getUserOrgId(user.id);
}
