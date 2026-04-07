import { create } from 'zustand';
import { MOCK_ROLES, MOCK_CANDIDATES, MOCK_ASSESSMENTS } from '@/lib/constants';

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

  roles: MOCK_ROLES,
  candidates: MOCK_CANDIDATES,
  assessments: MOCK_ASSESSMENTS,

  addCandidateModalOpen: false,
  sidebarCollapsed: false,
  draft: null,

  notifications: [
    { id: 1, type: 'assessment', title: 'Assessment completed', message: 'Alex Chen completed the AI Research Engineer assessment', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 2, type: 'candidate', title: 'New candidate added', message: 'Sarah Kim was added to the candidate pool', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 3, type: 'role', title: 'Role status changed', message: 'ML Platform Engineer role is now active', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  ],

  setHiringManager: (data) => set((s) => ({ hiringManager: { ...s.hiringManager, ...data } })),
  setCompany: (data) => set((s) => ({ company: { ...s.company, ...data } })),

  removeRole: (id) => set((s) => ({ roles: s.roles.filter((r) => r.id !== id) })),
  updateRole: (id, data) => set((s) => ({ roles: s.roles.map((r) => r.id === id ? { ...r, ...data } : r) })),
  duplicateRole: (id) => set((s) => {
    var role = s.roles.find((r) => r.id === id);
    if (!role) return {};
    return { roles: [{ ...role, id: Date.now(), title: role.title + ' (Copy)', status: 'draft', createdAt: new Date().toISOString() }, ...s.roles] };
  }),
  addRole: (role) => set((s) => ({
    roles: [{
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
      sharableLink: 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10),
      ...role,
    }, ...s.roles],
  })),
  addCandidate: (candidate) => set((s) => ({
    candidates: [...s.candidates, { id: Date.now(), assessments: 0, lastActive: '\u2014', ...candidate }],
  })),
  removeCandidate: (id) => set((s) => ({
    candidates: s.candidates.filter((c) => c.id !== id),
  })),
  addAssessment: (assessment) => set((s) => ({
    assessments: [{ id: 'a-' + Date.now(), ...assessment }, ...s.assessments],
  })),

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
