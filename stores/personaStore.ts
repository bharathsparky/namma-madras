import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { Persona } from '@/db/types';

const KEY = '@csg/persona';

type State = {
  persona: Persona;
  setPersona: (p: Persona) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const usePersonaStore = create<State>((set) => ({
  persona: '',
  setPersona: async (persona) => {
    await AsyncStorage.setItem(KEY, persona);
    set({ persona });
  },
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(KEY);
      const valid: Persona[] = ['crisis', 'migrant', 'student', 'jobseeker', 'helper', ''];
      const persona = valid.includes(stored as Persona) ? (stored as Persona) : '';
      set({ persona });
    } catch {
      set({ persona: '' });
    }
  },
}));
