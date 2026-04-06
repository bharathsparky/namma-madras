import type { ImageSourcePropType } from 'react-native';
import { emergencyHubHero } from '@/constants/emergencyHubHero';
import { hygieneHubHero } from '@/constants/hygieneHubHero';
import type { SuperAppHeroTheme } from '@/constants/homeHero';
import { medicalHubHero } from '@/constants/medicalHubHero';
import { learnHubHero } from '@/constants/learnHubHero';
import { stayHubHero } from '@/constants/stayHubHero';
import { workHubHero } from '@/constants/workHubHero';

const STAY_ILLUSTRATION = require('../assets/images/hub-stay-hero-illustration.png');
const LEARN_ILLUSTRATION = require('../assets/images/hub-learn-hero-illustration.png');
const MEDICAL_HERO_BANNER = require('../assets/images/hub-medical-hero-banner.png');
const WORK_HERO_BANNER = require('../assets/images/hub-work-hero-banner.png');
const HYGIENE_HERO_BANNER = require('../assets/images/hub-hygiene-hero-banner.png');
const EMERGENCY_HERO_BANNER = require('../assets/images/hub-emergency-hero-banner.png');

export type CategoryHubVisualConfig = {
  theme: SuperAppHeroTheme;
  illustration: ImageSourcePropType;
  /** Wide banners read better as `cover` in the hero strip; default is `contain`. */
  illustrationResizeMode?: 'contain' | 'cover';
};

const HUB_VISUAL_BY_SLUG: Record<string, CategoryHubVisualConfig> = {
  stay: {
    theme: stayHubHero,
    illustration: STAY_ILLUSTRATION,
    /** Dorm/shelter scene — fill hero strip */
    illustrationResizeMode: 'cover',
  },
  medical: {
    theme: medicalHubHero,
    illustration: MEDICAL_HERO_BANNER,
    illustrationResizeMode: 'cover',
  },
  learn: {
    theme: learnHubHero,
    illustration: LEARN_ILLUSTRATION,
    illustrationResizeMode: 'cover',
  },
  work: {
    theme: workHubHero,
    illustration: WORK_HERO_BANNER,
    illustrationResizeMode: 'cover',
  },
  hygiene: {
    theme: hygieneHubHero,
    illustration: HYGIENE_HERO_BANNER,
    illustrationResizeMode: 'cover',
  },
};

export function getCategoryHubVisual(slug: string): CategoryHubVisualConfig | null {
  return HUB_VISUAL_BY_SLUG[slug.trim().toLowerCase()] ?? null;
}

/** Emergency route — dedicated preparedness flat-lay; emergency-tinted hero theme. */
export const emergencyHubVisual: CategoryHubVisualConfig = {
  theme: emergencyHubHero,
  illustration: EMERGENCY_HERO_BANNER,
  illustrationResizeMode: 'cover',
};
