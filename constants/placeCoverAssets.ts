import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled hero thumbnails for places whose `cover_image_url` is null in SQLite.
 * Keys are final DB primary keys (`FOOD_PLACE_ID_OFFSET` + seed `id` from `db/seed.ts`).
 */
export const PLACE_COVER_LOCAL: Record<number, ImageSourcePropType> = {
  /** Hare Krishna Movement (ISKCON) — HKM Chennai, Thiruvanmiyur — seed id 1 */
  10001: require('../assets/places/hare-krishna-movement-hkm-chennai.png'),
  /** ISKCON Temple Chennai (Radha Krishna Mandir), Sholinganallur — seed id 2 */
  10002: require('../assets/places/iskcon-temple-sholinganallur.png'),
  /** Arulmigu Parthasarathy Temple, Triplicane — seed id 3 */
  10003: require('../assets/places/parthasarathy-temple-triplicane.png'),
  /** Arulmigu Kapaleeshwarar Temple, Mylapore — seed id 4 */
  10004: require('../assets/places/kapaleeshwarar-temple-mylapore.png'),
  /** Arulmigu Vadapalani Murugan Temple — seed id 5 */
  10005: require('../assets/places/vadapalani-murugan-temple.png'),
  /** Arulmigu Marundeeswarar Temple, Thiruvanmiyur — seed id 7 */
  10007: require('../assets/places/marundeeswarar-temple-thiruvanmiyur.png'),
  /** Arulmigu Ashtalakshmi Temple, Besant Nagar — seed id 8 */
  10008: require('../assets/places/ashtalakshmi-temple-besant-nagar.png'),
  /** Gurudwara Sahib, Egmore — seed id 11 */
  10011: require('../assets/places/gurudwara-sahib-egmore.png'),
  /** Rayar Mutt — T. Nagar — seed id 13 */
  10013: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Rayar Mutt — Triplicane — seed id 14 */
  10014: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Rayar Mutt — Nanganallur — seed id 15 */
  10015: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Rayar Mutt — Ayanavaram — seed id 16 */
  10016: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Rayar Mutt — Saligramam — seed id 17 */
  10017: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Rayar Mutt — Ambattur — seed id 18 */
  10018: require('../assets/places/rayar-mutt-raghavendra-swami.png'),
  /** Guruvayurappan Temple, Nanganallur — seed id 22 */
  10022: require('../assets/places/guruvayurappan-temple-nanganallur.png'),
  /** Gangadeeshwarar Temple, Purasaiwalkam — seed id 24 */
  10024: require('../assets/places/gangadeeshwarar-temple-purasaiwalkam.png'),
  /** Alwarpet Anjaneyar Temple — seed id 26 */
  10026: require('../assets/places/alwarpet-anjaneyar-temple.png'),
  /** Ashok Nagar Anjaneyar Temple — seed id 27 */
  10027: require('../assets/places/ashok-nagar-anjaneyar-temple.png'),
  /** Ayyappan Kovil, Mahalingapuram — seed id 28 */
  10028: require('../assets/places/ayyappan-kovil-mahalingapuram.png'),
  /** Bhakta Anjaneyar Temple, Korattur — seed id 29 */
  10029: require('../assets/places/bhakta-anjaneyar-temple-korattur.png'),
  /** Ayyappan Temple, K K Nagar — seed id 32 */
  10032: require('../assets/places/ayyappan-temple-kk-nagar.png'),
  /** Chennai Food Bank (RYA Madras Metro Trust) — seed id 36 */
  10036: require('../assets/places/chennai-food-bank.png'),
  /** Annai Teresa Foundation (Kilpauk) — seed id 38 */
  10038: require('../assets/places/annai-teresa-foundation-kilpauk.png'),
  /** Udhavum Ullangal — seed id 40 */
  10040: require('../assets/places/udhavum-ullangal.png'),
  /** Arunodhaya Centre for Street Children, Chetpet — seed id 41 */
  10041: require('../assets/places/arunodhaya-street-children-centre.png'),
  /** Amma Unavagam (GCC subsidised canteens) — seed id 47 */
  10047: require('../assets/places/amma-unavagam-canteen.png'),
};

export function getLocalPlaceCover(placeId: number): ImageSourcePropType | undefined {
  return PLACE_COVER_LOCAL[placeId];
}

/**
 * Bundled `PLACE_COVER_LOCAL` wins, then optional `cover_image_url` (your own hosted originals / CDN).
 * No third-party stock imagery — otherwise cards use the gradient + category icon.
 */
export function getPlaceCoverSource(place: {
  id: number;
  cover_image_url?: string | null;
}): ImageSourcePropType | null {
  const local = getLocalPlaceCover(place.id);
  if (local) return local;
  const uri = (place.cover_image_url ?? '').trim();
  if (uri.length > 8) return { uri };
  return null;
}
