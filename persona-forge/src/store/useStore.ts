import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Persona, PersonaVersion, ThemeMode, AppState, Toast } from '../types';

interface Store extends AppState {
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
  setActivePersona: (id: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setActiveView: (view: string) => void;
  duplicatePersona: (id: string) => void;
  duplicateAsVariant: (id: string, variantName: string) => void;
  addToTeam: (persona: Persona) => void;
  removeFromTeam: (id: string) => void;
  getShareableLink: (id: string) => string;
  revertToVersion: (id: string, version: number) => void;
  getVersionHistory: (id: string) => PersonaVersion[];
  searchQuery: string;
  filterTag: string | null;
  setSearchQuery: (query: string) => void;
  setFilterTag: (tag: string | null) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  deleteMultiple: (ids: string[]) => void;
  exportAll: () => string;
  importAll: (json: string) => { success: boolean; error?: string };
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const defaultPersona = {
  name: '',
  role: '',
  avatar: '',
  demographics: { age: '', location: '', income: '', education: '' },
  background: '',
  goals: [],
  painPoints: [],
  motivations: [],
  behaviors: [],
  quote: '',
  personalityTraits: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 },
  communicationStyle: '',
  preferredChannels: [],
  techSavvy: 50,
  brandValues: [],
  preferredTone: '',
  tags: [],
  notes: '',
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      personas: [],
      teamLibrary: [],
      activePersonaId: null,
      theme: 'light',
      activeView: 'dashboard',

      addPersona: (persona) => set((state) => ({ personas: [...state.personas, persona] })),

      updatePersona: (id, updates) => set((state) => ({
        personas: state.personas.map((p) => {
          if (p.id !== id) return p;
          return { ...p, ...updates, updatedAt: new Date().toISOString() };
        }),
      })),

      deletePersona: (id) => set((state) => ({ personas: state.personas.filter((p) => p.id !== id), activePersonaId: state.activePersonaId === id ? null : state.activePersonaId })),
      setActivePersona: (id) => set({ activePersonaId: id }),
      setTheme: (theme) => set({ theme }),
      setActiveView: (view) => set({ activeView: view }),

      duplicatePersona: (id) => set((state) => {
        const original = state.personas.find((p) => p.id === id);
        if (!original) return state;
        const duplicate: Persona = { ...original, id: crypto.randomUUID(), name: `${original.name} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        return { personas: [...state.personas, duplicate] };
      }),

      duplicateAsVariant: (id, variantName) => set((state) => {
        const original = state.personas.find((p) => p.id === id);
        if (!original) return state;
        const variant: Persona = { ...original, id: crypto.randomUUID(), name: variantName, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        return { personas: [...state.personas, variant] };
      }),

      addToTeam: (persona) => set((state) => ({ teamLibrary: [...state.teamLibrary, persona] })),
      removeFromTeam: (id) => set((state) => ({ teamLibrary: state.teamLibrary.filter((p) => p.id !== id) })),

      getShareableLink: (id) => { const baseUrl = window.location.origin; return `${baseUrl}/shared/${id}`; },

      revertToVersion: (id, version) => set((state) => ({
        personas: state.personas.map((p) => {
          if (p.id !== id) return p;
          const targetVersion = p.versionHistory?.find((v) => v.version === version);
          if (!targetVersion) return p;
          const newVersion = (p.version || 1) + 1;
          const versionEntry: PersonaVersion = { version: p.version || 1, timestamp: p.updatedAt, changes: `Reverted to v${version}`, data: { ...p } };
          return { ...p, ...targetVersion.data, version: newVersion, versionHistory: [...(p.versionHistory || []), versionEntry], updatedAt: new Date().toISOString() };
        }),
      })),

      getVersionHistory: (id) => { const persona = get().personas.find((p) => p.id === id); return persona?.versionHistory || []; },

      searchQuery: '',
      filterTag: null,
      toast: null,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterTag: (tag) => set({ filterTag: tag }),

      addTag: (id, tag) => set((state) => ({ personas: state.personas.map((p) => p.id === id ? { ...p, tags: [...(p.tags || []), tag] } : p) })),
      removeTag: (id, tag) => set((state) => ({ personas: state.personas.map((p) => p.id === id ? { ...p, tags: (p.tags || []).filter((t) => t !== tag) } : p) })),

      deleteMultiple: (ids) => set((state) => ({ personas: state.personas.filter((p) => !ids.includes(p.id)), activePersonaId: ids.includes(state.activePersonaId || '') ? null : state.activePersonaId })),

      exportAll: () => { const state = get(); return JSON.stringify(state.personas, null, 2); },

      importAll: (json) => {
        try {
          const imported = JSON.parse(json) as Persona[];
          set((state) => ({ personas: [...state.personas, ...imported] }));
          return { success: true };
        } catch { return { success: false, error: 'Invalid JSON' }; }
      },

      showToast: (message, type = 'success') => {
        set({ toast: { id: crypto.randomUUID(), message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      hideToast: () => set({ toast: null }),
    }),
    { name: 'persona-forge-storage' }
  )
);

export const getDefaultPersona = (): Omit<Persona, 'id' | 'createdAt' | 'updatedAt'> => ({ ...JSON.parse(JSON.stringify(defaultPersona)), version: 1, versionHistory: [] });
export { defaultPersona };
export type { Persona, ThemeMode, AppState };