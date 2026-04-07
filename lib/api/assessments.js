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

// Main fetch: only show assessments linked to the user's organization
// (via hiring_candidates.organization_id → challenges)
export async function fetchAssessments(hostId, orgId) {
  // Only fetch org-linked assessments — host-based fetch pulled in
  // unrelated challenges from other workflows
  return fetchAssessmentsByOrg(orgId);
}

// Create a new assessment (challenge) and link candidates
export async function createAssessmentDb(hostId, orgId, assessment) {
  if (!supabase || !hostId) return null;
  const { data, error } = await supabase
    .from('challenges')
    .insert({
      host_id: hostId,
      title: assessment.name || 'New Assessment',
      status: assessment.status || 'published',
      source_position: assessment.roleTitle || '',
      primary_deliverable: assessment.task || '',
    })
    .select()
    .single();
  if (error) { console.error('createAssessment error:', error); return null; }

  // Link candidates to this challenge
  var candIds = assessment.candIds || [];
  if (candIds.length > 0 && data.id) {
    var { error: linkError } = await supabase
      .from('hiring_candidates')
      .update({ challenge_id: data.id })
      .in('id', candIds);
    if (linkError) console.error('linkCandidates error:', linkError);
  }

  return toAppAssessment(data, {});
}

// Helper: fetch candidates grouped by challenge_id
async function fetchCandidatesForChallenges(challengeIds) {
  if (!supabase || challengeIds.length === 0) return {};
  const { data, error } = await supabase
    .from('hiring_candidates')
    .select('id, name, email, challenge_id, evaluation_id, status')
    .in('challenge_id', challengeIds);
  if (error) { console.error('fetchCandidatesForChallenges error:', error); return {}; }

  const grouped = {};
  (data || []).forEach((c) => {
    if (!grouped[c.challenge_id]) grouped[c.challenge_id] = [];
    grouped[c.challenge_id].push(c);
  });
  return grouped;
}
