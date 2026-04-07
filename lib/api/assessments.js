import { supabase } from '@/lib/supabase';

// Assessments use the `challenges` table
// Candidates linked via `hiring_candidates.challenge_id`

function toAppAssessment(row, candidatesByChallenge) {
  const cands = candidatesByChallenge[row.id] || [];
  return {
    id: row.id,
    name: row.title || '',
    roleTitle: row.source_position || '',
    status: row.status || 'draft',
    skill: '',
    task: row.primary_deliverable || '',
    createdAt: row.created_at,
    candIds: cands.map((c) => c.id),
    candNames: cands.map((c) => c.name),
    results: cands.filter((c) => c.evaluation_id).map((c) => ({
      candId: c.id,
      score: 0,
      grade: '',
      feedback: '',
    })),
  };
}

// Fetch assessments by host_id (the user who created them)
export async function fetchAssessmentsByHost(hostId) {
  if (!supabase || !hostId) return null;
  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, status, created_at, source_position, primary_deliverable, host_id')
    .eq('host_id', hostId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.error('fetchAssessmentsByHost error:', error); return null; }
  if (!data || data.length === 0) return [];

  // Fetch candidates for these challenges
  const challengeIds = data.map((d) => d.id);
  const candidatesByChallenge = await fetchCandidatesForChallenges(challengeIds);

  return data.map((row) => toAppAssessment(row, candidatesByChallenge));
}

// Fetch assessments by organization (via hiring_candidates linked to challenges)
export async function fetchAssessmentsByOrg(orgId) {
  if (!supabase || !orgId) return null;

  // Get challenge IDs that have candidates in this org
  const { data: orgCandidates, error: candError } = await supabase
    .from('hiring_candidates')
    .select('challenge_id')
    .eq('organization_id', orgId)
    .not('challenge_id', 'is', null);
  if (candError) { console.error('fetchAssessmentsByOrg cand error:', candError); return null; }

  const challengeIds = [...new Set((orgCandidates || []).map((c) => c.challenge_id).filter(Boolean))];
  if (challengeIds.length === 0) return [];

  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, status, created_at, source_position, primary_deliverable, host_id')
    .in('id', challengeIds)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.error('fetchAssessmentsByOrg error:', error); return null; }

  const candidatesByChallenge = await fetchCandidatesForChallenges(challengeIds);
  return (data || []).map((row) => toAppAssessment(row, candidatesByChallenge));
}

// Combined: try host first, then org
export async function fetchAssessments(hostId, orgId) {
  // Fetch from both sources and merge
  const [byHost, byOrg] = await Promise.all([
    fetchAssessmentsByHost(hostId),
    fetchAssessmentsByOrg(orgId),
  ]);

  const all = [...(byHost || []), ...(byOrg || [])];
  // Deduplicate by id
  const seen = new Set();
  return all.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

// Helper: fetch candidates grouped by challenge_id
async function fetchCandidatesForChallenges(challengeIds) {
  if (!supabase || challengeIds.length === 0) return {};
  const { data, error } = await supabase
    .from('hiring_candidates')
    .select('id, name, email, challenge_id, evaluation_id, status')
    .in('challenge_id', challengeIds);
  if (error) return {};

  const grouped = {};
  (data || []).forEach((c) => {
    if (!grouped[c.challenge_id]) grouped[c.challenge_id] = [];
    grouped[c.challenge_id].push(c);
  });
  return grouped;
}
