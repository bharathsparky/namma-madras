import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = '@csg/tamil_numerals';

type State = {
  tamilNumerals: boolean;
  setTamilNumerals: (v: boolean) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useSettingsStore = create<State>((set) => ({
  tamilNumerals: false,
  setTamilNumerals: async (v) => {
    await AsyncStorage.setItem(KEY, v ? '1' : '0');
    set({ tamilNumerals: v });
  },
  hydrate: async () => {
    try {
      const s = await AsyncStorage.getItem(KEY);
      set({ tamilNumerals: s === '1' });
    } catch {
      set({ tamilNumerals: false });
    }
  },
}));
