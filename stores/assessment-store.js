import { create } from 'zustand';

const initialState = {
  currentStep: 0,
  completedSteps: [],
  maxReachedStep: 0,

  role: {
    jd: '',
    title: '',
    company: '',
    sharableLink: '',
    parsedFrom: null,
    matchConfidence: 0,
    chatHistory: [],
  },

  cluster: { id: '', name: '' },

  pathway: { id: '', name: '' },

  selectedRole: {
    id: '',
    name: '',
    oneLiner: '',
    sourceOccupations: [],
  },

  task: {
    id: '',
    code: '',
    name: '',
    categoryCode: '',
    categoryName: '',
    aiDoes: '',
    humanDoes: '',
    produces: '',
  },

  context: {
    description: '',
    files: [],
    fileDescriptions: [],
    prediction: null,
    predictionSource: null,
  },

  environment: {
    role: '',
    taskType: '',
    jobTitle: '',
    contextText: '',
    yourRoleText: '',
    deliverables: [],
    resources: [],
    chatHistory: [],
  },

  candidates: [],
  teamTrial: false,

  rubrics: {
    dimensions: [],
    redFlags: [],
    scoringSystem: { weights: [], pitfalls: [] },
    totalRubrics: 0,
    modifications: [],
  },
};

export const useAssessmentStore = create((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  completeStep: (step) => set((state) => ({
    completedSteps: state.completedSteps.includes(step)
      ? state.completedSteps
      : [...state.completedSteps, step].sort((a, b) => a - b),
    maxReachedStep: Math.max(state.maxReachedStep, step + 1),
    currentStep: step + 1,
  })),

  goToStep: (step) => {
    const state = get();
    if (step <= state.maxReachedStep) {
      set({ currentStep: step });
    }
  },

  updateRole: (data) => set((state) => ({ role: { ...state.role, ...data } })),
  updateCluster: (data) => set({ cluster: data }),
  updatePathway: (data) => set({ pathway: data }),
  updateSelectedRole: (data) => set({ selectedRole: data }),
  updateTask: (data) => set({ task: data }),
  updateContext: (data) => set((state) => ({ context: { ...state.context, ...data } })),
  updateEnvironment: (data) => set((state) => ({ environment: { ...state.environment, ...data } })),

  addCandidate: (candidate) => set((state) => ({
    candidates: [...state.candidates, { id: Date.now(), ...candidate }],
  })),
  removeCandidate: (id) => set((state) => ({
    candidates: state.candidates.filter((c) => c.id !== id),
  })),
  updateCandidate: (id, data) => set((state) => ({
    candidates: state.candidates.map((c) => c.id === id ? { ...c, ...data } : c),
  })),
  setTeamTrial: (val) => set({ teamTrial: val }),

  updateRubrics: (data) => set((state) => ({ rubrics: { ...state.rubrics, ...data } })),

  reset: () => set(initialState),
}));
