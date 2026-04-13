import type { ImageSourcePropType } from 'react-native';

/**
 * Category grid tiles — aligned with hub hero art (`categoryHubVisual` / food home hero).
 * Stay / learn / medical / work / hygiene / emergency use the same assets as `categoryHubVisual` where applicable.
 */
const CATEGORY_TILE_IMAGE: Record<string, ImageSourcePropType> = {
  /** South Indian thali — category chip / promo tile (squircle mask in UI). */
  food: require('../assets/images/category-food-thali.webp'),
  /** Shared room / beds — category chip, promo tile, stay hub hero. */
  stay: require('../assets/images/category-stay-room.webp'),
  /** Ambulance / emergency care — category chip, promo tile, medical hub hero. */
  medical: require('../assets/images/category-medical-ambulance.webp'),
  /** Books / study — learn category tile & hub hero. */
  learn: require('../assets/images/category-learn-books.webp'),
  /** Hard hat + work gloves — category tile & work hub hero. */
  work: require('../assets/images/category-work-hard-hat.webp'),
  /** Red phone booth / communication — emergency category tile & hub hero. */
  emergency: require('../assets/images/category-emergency-phone-booth.webp'),
  /** Shower / bath products — hygiene category tile & hub hero. */
  hygiene: require('../assets/images/category-hygiene-shower.webp'),
};

export function categoryTileImageForSlug(slug: string): ImageSourcePropType {
  return CATEGORY_TILE_IMAGE[slug] ?? CATEGORY_TILE_IMAGE.food;
}
