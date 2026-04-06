import type { ImageSourcePropType } from 'react-native';

/**
 * Category grid tiles — aligned with hub hero art (`categoryHubVisual` / food home hero).
 * Stay / learn / medical / work / hygiene / emergency use the same assets as `categoryHubVisual` where applicable.
 */
const CATEGORY_TILE_IMAGE: Record<string, ImageSourcePropType> = {
  food: require('../assets/images/food-hero-illustration.png'),
  stay: require('../assets/images/hub-stay-hero-illustration.png'),
  medical: require('../assets/images/hub-medical-hero-banner.png'),
  learn: require('../assets/images/hub-learn-hero-illustration.png'),
  work: require('../assets/images/hub-work-hero-banner.png'),
  emergency: require('../assets/images/hub-emergency-hero-banner.png'),
  hygiene: require('../assets/images/hub-hygiene-hero-banner.png'),
};

export function categoryTileImageForSlug(slug: string): ImageSourcePropType {
  return CATEGORY_TILE_IMAGE[slug] ?? CATEGORY_TILE_IMAGE.food;
}
