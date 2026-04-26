export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  demographics: {
    age: string;
    location: string;
    income: string;
    education: string;
  };
  background: string;
  goals: string[];
  painPoints: string[];
  motivations: string[];
  behaviors: string[];
  quote: string;
  personalityTraits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  communicationStyle: string;
  preferredChannels: string[];
  techSavvy: number;
  brandValues: string[];
  preferredTone: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  versionHistory?: PersonaVersion[];
  tags: string[];
  notes: string;
}

export interface PersonaVersion {
  version: number;
  timestamp: string;
  changes: string;
  data: Partial<Persona>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  persona: Partial<Persona>;
}

export type ThemeMode = 'light' | 'dark';
export type ViewMode = 'edit' | 'view';

export interface AppState {
  personas: Persona[];
  teamLibrary: Persona[];
  activePersonaId: string | null;
  theme: ThemeMode;
  activeView: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}