import { create } from 'zustand';
import { MOCK_ROLES, MOCK_CANDIDATES, MOCK_CHALLENGES } from '@/lib/constants';

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
  challenges: MOCK_CHALLENGES,

  addCandidateModalOpen: false,
  sidebarCollapsed: false,
  draft: null,

  setHiringManager: (data) => set((s) => ({ hiringManager: { ...s.hiringManager, ...data } })),
  setCompany: (data) => set((s) => ({ company: { ...s.company, ...data } })),

  addRole: (role) => set((s) => ({ roles: [{ id: Date.now(), ...role }, ...s.roles] })),
  addCandidate: (candidate) => set((s) => ({
    candidates: [...s.candidates, { id: Date.now(), ...candidate }],
  })),
  addChallenge: (challenge) => set((s) => ({
    challenges: [{ id: 'ch-' + Date.now(), ...challenge }, ...s.challenges],
  })),

  openAddCandidateModal: () => set({ addCandidateModalOpen: true }),
  closeAddCandidateModal: () => set({ addCandidateModalOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

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
