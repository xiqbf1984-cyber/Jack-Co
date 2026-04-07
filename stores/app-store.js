import { create } from 'zustand';
import { MOCK_ROLES, MOCK_CANDIDATES, MOCK_ASSESSMENTS } from '@/lib/constants';
import { supabase, getUserByClerkId, getUserOrgId } from '@/lib/supabase';
import { fetchRoles, createRole, updateRoleDb, deleteRoleDb, duplicateRoleDb } from '@/lib/api/roles';
import { fetchCandidates, createCandidateDb, updateCandidateDb, deleteCandidateDb } from '@/lib/api/candidates';
import { fetchAssessments, createAssessmentDb } from '@/lib/api/assessments';

export const useAppStore = create((set, get) => ({
  hiringManager: {
    name: '',
    title: '',
    department: '',
    reportsTo: '',
    linkedinUrl: '',
    resumeFileName: null,
  },

  company: {
    name: 'Your Company',
    logo: 'C',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '50-200',
    website: 'yourcompany.com',
    description: '',
  },

  // Data starts empty; will be filled from Supabase or fallback to MOCK
  roles: [],
  candidates: [],
  assessments: [],

  // Loading states
  rolesLoading: false,
  candidatesLoading: false,
  assessmentsLoading: false,
  dataInitialized: false,

  // User context from Supabase
  dbUser: null,       // { id, clerk_id, email, name, avatar_url }
  orgId: null,        // organization_id

  addCandidateModalOpen: false,
  sidebarCollapsed: false,
  draft: null,

  notifications: [
    { id: 1, type: 'assessment', title: 'Assessment completed', message: 'Alex Chen completed the AI Research Engineer assessment', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 2, type: 'candidate', title: 'New candidate added', message: 'Sarah Kim was added to the candidate pool', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 3, type: 'role', title: 'Role status changed', message: 'ML Platform Engineer role is now active', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  ],

  // ─── Initialize: resolve clerk user → DB user → org ───
  initializeData: async (clerkId) => {
    if (get().dataInitialized) return;

    if (!supabase || !clerkId) {
      // Fallback to mock data when Supabase is not configured
      set({
        roles: MOCK_ROLES,
        candidates: MOCK_CANDIDATES,
        assessments: MOCK_ASSESSMENTS,
        dataInitialized: true,
      });
      return;
    }

    // Resolve user
    const dbUser = await getUserByClerkId(clerkId);
    if (!dbUser) {
      console.warn('User not found in Supabase, using mock data');
      set({ roles: MOCK_ROLES, candidates: MOCK_CANDIDATES, assessments: MOCK_ASSESSMENTS, dataInitialized: true });
      return;
    }

    const orgId = await getUserOrgId(dbUser.id);
    set({ dbUser, orgId });

    // Fetch org info
    if (orgId) {
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();
      if (org) {
        set({
          company: {
            name: org.name || 'Your Company',
            logo: org.logo_url || (org.name ? org.name[0] : 'C'),
            industry: org.industry || 'Technology',
            location: org.location || '',
            size: org.size || '50-200',
            website: org.website || '',
            description: org.description || '',
          },
        });
      }
    }

    // Fetch all data in parallel
    set({ rolesLoading: true, candidatesLoading: true, assessmentsLoading: true });

    const [rolesData, candidatesData, assessmentsData] = await Promise.all([
      orgId ? fetchRoles(orgId) : null,
      orgId ? fetchCandidates(orgId) : null,
      fetchAssessments(dbUser.id, orgId),
    ]);

    set({
      roles: rolesData || [],
      candidates: candidatesData || [],
      assessments: assessmentsData || [],
      rolesLoading: false,
      candidatesLoading: false,
      assessmentsLoading: false,
      dataInitialized: true,
    });
  },

  setHiringManager: (data) => set((s) => ({ hiringManager: { ...s.hiringManager, ...data } })),
  setCompany: (data) => set((s) => ({ company: { ...s.company, ...data } })),

  // ─── Roles: optimistic update + async DB sync ───
  removeRole: (id) => {
    set((s) => ({ roles: s.roles.filter((r) => r.id !== id) }));
    deleteRoleDb(id).catch((e) => console.error('deleteRole failed:', e));
  },

  updateRole: (id, data) => {
    set((s) => ({ roles: s.roles.map((r) => r.id === id ? { ...r, ...data } : r) }));
    updateRoleDb(id, data).catch((e) => console.error('updateRole failed:', e));
  },

  duplicateRole: (id) => {
    const s = get();
    const role = s.roles.find((r) => r.id === id);
    if (!role) return;

    // Optimistic: add temp role with timestamp ID
    const tempId = 'temp-' + Date.now();
    const tempRole = { ...role, id: tempId, title: role.title + ' (Copy)', status: 'draft', createdAt: new Date().toISOString() };
    set({ roles: [tempRole, ...s.roles] });

    // Async: create in DB, replace temp with real
    if (s.orgId) {
      duplicateRoleDb(id, s.orgId).then((dbRole) => {
        if (dbRole) {
          set((cur) => ({
            roles: cur.roles.map((r) => r.id === tempId ? dbRole : r),
          }));
        }
      }).catch((e) => console.error('duplicateRole failed:', e));
    }
  },

  addRole: (role) => {
    const s = get();
    const tempId = 'temp-' + Date.now();
    const tempRole = {
      id: tempId,
      status: 'active',
      createdAt: new Date().toISOString(),
      isPrivate: false,
      ...role,
    };
    set({ roles: [tempRole, ...s.roles] });

    // Async: create in DB
    if (s.orgId) {
      createRole(s.orgId, role, s.dbUser?.id).then((dbRole) => {
        if (dbRole) {
          set((cur) => ({
            roles: cur.roles.map((r) => r.id === tempId ? dbRole : r),
          }));
        }
      }).catch((e) => console.error('addRole failed:', e));
    }
  },

  // ─── Candidates: optimistic + DB sync ───
  addCandidate: (candidate) => {
    const s = get();
    const tempId = 'temp-' + Date.now();
    const initials = candidate.name
      ? candidate.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
      : '??';
    const tempCandidate = {
      id: tempId,
      assessments: 0,
      lastActive: '\u2014',
      avatar: initials,
      ...candidate,
    };
    set({ candidates: [...s.candidates, tempCandidate] });

    if (s.orgId) {
      createCandidateDb(s.orgId, candidate).then((dbCandidate) => {
        if (dbCandidate) {
          set((cur) => ({
            candidates: cur.candidates.map((c) => c.id === tempId ? dbCandidate : c),
          }));
        }
      }).catch((e) => console.error('addCandidate failed:', e));
    }
  },

  updateCandidate: (id, data) => {
    set((s) => ({ candidates: s.candidates.map((c) => c.id === id ? { ...c, ...data } : c) }));
    updateCandidateDb(id, data).catch((e) => console.error('updateCandidate failed:', e));
  },

  removeCandidate: (id) => {
    set((s) => ({ candidates: s.candidates.filter((c) => c.id !== id) }));
    deleteCandidateDb(id).catch((e) => console.error('deleteCandidate failed:', e));
  },

  addAssessment: (assessment) => {
    const s = get();
    const tempId = 'a-' + Date.now();
    const tempAssessment = { id: tempId, createdAt: new Date().toISOString(), ...assessment };
    set({ assessments: [tempAssessment, ...s.assessments] });

    // Async: sync to DB
    if (s.dbUser?.id && s.orgId) {
      createAssessmentDb(s.dbUser.id, s.orgId, assessment).then((dbAssessment) => {
        if (dbAssessment) {
          set((cur) => ({
            assessments: cur.assessments.map((a) => a.id === tempId ? { ...tempAssessment, ...dbAssessment } : a),
          }));
        }
      }).catch((e) => console.error('addAssessment failed:', e));
    }
  },

  openAddCandidateModal: () => set({ addCandidateModalOpen: true }),
  closeAddCandidateModal: () => set({ addCandidateModalOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addNotification: (notification) => set((s) => ({
    notifications: [{ id: Date.now(), read: false, timestamp: new Date().toISOString(), ...notification }, ...s.notifications],
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),
  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),

  saveDraft: (assessmentData) => {
    const draft = { data: assessmentData, savedAt: new Date().toISOString() };
    set({ draft });
    try { localStorage.setItem('assessment-draft', JSON.stringify(draft)); } catch (e) {}
  },
  loadDraft: () => {
    try {
      const raw = localStorage.getItem('assessment-draft');
      if (!raw) return null;
      const draft = JSON.parse(raw);
      const saved = new Date(draft.savedAt);
      if (Date.now() - saved.getTime() > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('assessment-draft');
        return null;
      }
      set({ draft });
      return draft;
    } catch (e) { return null; }
  },
  clearDraft: () => {
    set({ draft: null });
    try { localStorage.removeItem('assessment-draft'); } catch (e) {}
  },
}));
