import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = '@csg/onboarding_complete';

type State = {
  complete: boolean;
  hydrated: boolean;
  setComplete: (v: boolean) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useOnboardingStore = create<State>((set) => ({
  complete: false,
  hydrated: false,
  setComplete: async (v) => {
    await AsyncStorage.setItem(KEY, v ? '1' : '0');
    set({ complete: v });
  },
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(KEY);
      set({ complete: stored === '1', hydrated: true });
    } catch {
      set({ complete: false, hydrated: true });
    }
  },
}));
