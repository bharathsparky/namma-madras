import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { Lang } from '@/db/types';
import i18n from '@/i18n';

const KEY = '@csg/language';

type State = {
  language: Lang;
  hydrated: boolean;
  setLanguage: (lang: Lang) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useLanguageStore = create<State>((set) => ({
  language: 'en',
  hydrated: false,
  setLanguage: async (lang) => {
    await AsyncStorage.setItem(KEY, lang);
    await i18n.changeLanguage(lang);
    set({ language: lang });
  },
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(KEY);
      const lang: Lang =
        stored === 'en' || stored === 'ta' || stored === 'hi' ? stored : 'en';
      await i18n.changeLanguage(lang);
      set({ language: lang, hydrated: true });
    } catch {
      await i18n.changeLanguage('en');
      set({ language: 'en', hydrated: true });
    }
  },
}));
