import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import hiBrand from '../locales/hi/translation.json';
import hiUi from './hi-ui.json';
import hiHealthcare from '../locales/hi/healthcare.json';
import hiHygiene from '../locales/hi/hygiene.json';
import hiLearn from '../locales/hi/learn.json';
import hiPlaces from '../locales/hi/places.json';
import hiStay from '../locales/hi/stay.json';
import hiWork from '../locales/hi/work.json';
import enBrand from '../locales/en/translation.json';
import taBrand from '../locales/ta/translation.json';
import en from './en.json';
import ta from './ta.json';

const enMerged = { ...en, ...enBrand };
const taMerged = { ...ta, ...taBrand };

/** App copy defaults to English until the user picks a language in onboarding / Settings. */
const defaultLng = 'en';

/** Hindi UI from `hi-ui.json`; seed copy uses `places`, `healthcare`, etc. */
const hiTranslation = {
  ...enMerged,
  ...hiUi,
  ...hiBrand,
  places: hiPlaces,
  healthcare: hiHealthcare,
  stay: hiStay,
  work: hiWork,
  learn: hiLearn,
  hygiene: hiHygiene,
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enMerged },
    ta: { translation: taMerged },
    hi: { translation: hiTranslation },
  },
  lng: defaultLng,
  fallbackLng: 'en',
  supportedLngs: ['ta', 'en', 'hi'],
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
