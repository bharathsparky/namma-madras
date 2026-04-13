import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled hero thumbnails for places whose `cover_image_url` is null in SQLite.
 * Keys are final DB primary keys: food uses `FOOD_PLACE_ID_OFFSET` + seed `id` from `db/seed.ts`;
 * stay uses `STAY_PLACE_ID_OFFSET` (30_000) + seed `id` from `data/seeds/stay.ts`.
 */
const GCC_NIGHT_SHELTER_COVER = require('../assets/places/gcc-greater-chennai-corporation.webp');

/** `category === 'gcc_shelter'` rows — keep in sync with `data/seeds/stay.ts` (30_000 + seed `id`). */
const GCC_NIGHT_SHELTER_PLACE_IDS = [
  30001, 30002, 30003, 30004, 30005, 30006, 30007, 30008, 30009, 30010, 30011, 30012, 30013, 30014,
  30015, 30016, 30017, 30018, 30019, 30020, 30021, 30022, 30023, 30024, 30025, 30026, 30027, 30028,
  30029, 30030, 30031, 30032, 30033, 30034, 30035, 30036, 30037, 30038, 30039, 30040, 30053, 30054,
] as const;

const GCC_NIGHT_SHELTER_COVERS = Object.fromEntries(
  GCC_NIGHT_SHELTER_PLACE_IDS.map((id) => [id, GCC_NIGHT_SHELTER_COVER]),
) as Record<number, ImageSourcePropType>;

export const PLACE_COVER_LOCAL: Record<number, ImageSourcePropType> = {
  /** Hare Krishna Movement (ISKCON) — HKM Chennai, Thiruvanmiyur — seed id 1 */
  10001: require('../assets/places/hare-krishna-movement-hkm-chennai.webp'),
  /** ISKCON Temple Chennai (Radha Krishna Mandir), Sholinganallur — seed id 2 */
  10002: require('../assets/places/iskcon-temple-sholinganallur.webp'),
  /** Arulmigu Parthasarathy Temple, Triplicane — seed id 3 */
  10003: require('../assets/places/parthasarathy-temple-triplicane.webp'),
  /** Arulmigu Kapaleeshwarar Temple, Mylapore — seed id 4 */
  10004: require('../assets/places/kapaleeshwarar-temple-mylapore.webp'),
  /** Arulmigu Vadapalani Murugan Temple — seed id 5 */
  10005: require('../assets/places/vadapalani-murugan-temple.webp'),
  /** Saibaba Temple Mylapore — seed id 6 */
  10006: require('../assets/places/saibaba-temple-mylapore.webp'),
  /** Arulmigu Marundeeswarar Temple, Thiruvanmiyur — seed id 7 */
  10007: require('../assets/places/marundeeswarar-temple-thiruvanmiyur.webp'),
  /** Arulmigu Ashtalakshmi Temple, Besant Nagar — seed id 8 */
  10008: require('../assets/places/ashtalakshmi-temple-besant-nagar.webp'),
  /** Gurudwara Sahib, Egmore — seed id 11 */
  10011: require('../assets/places/gurudwara-sahib-egmore.webp'),
  /** Rayar Mutt — T. Nagar — seed id 13 */
  10013: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Rayar Mutt — Triplicane — seed id 14 */
  10014: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Rayar Mutt — Nanganallur — seed id 15 */
  10015: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Rayar Mutt — Ayanavaram — seed id 16 */
  10016: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Rayar Mutt — Saligramam — seed id 17 */
  10017: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Rayar Mutt — Ambattur — seed id 18 */
  10018: require('../assets/places/rayar-mutt-raghavendra-swami.webp'),
  /** Sankara Madam — seed id 20 */
  10020: require('../assets/places/sankara-madam-west-mambalam.webp'),
  /** Nanganallur Anjeneyar Temple — seed id 21 */
  10021: require('../assets/places/nanganallur-anjeneyar-temple.png'),
  /** Guruvayurappan Temple, Nanganallur — seed id 22 */
  10022: require('../assets/places/guruvayurappan-temple-nanganallur.webp'),
  /** Sri Saravamangala Sri Lakshmi Narasimha Swamy Temple, Nanganallur — seed id 23 */
  10023: require('../assets/places/lakshmi-narasimha-temple-nanganallur.webp'),
  /** Gangadeeshwarar Temple, Purasaiwalkam — seed id 24 */
  10024: require('../assets/places/gangadeeshwarar-temple-purasaiwalkam.webp'),
  /** Siva Veera Anjeneyar Temple, Porur — seed id 25 */
  10025: require('../assets/places/siva-veera-anjeneyar-temple-porur.png'),
  /** Alwarpet Anjaneyar Temple — seed id 26 */
  10026: require('../assets/places/alwarpet-anjaneyar-temple.webp'),
  /** Ashok Nagar Anjaneyar Temple — seed id 27 */
  10027: require('../assets/places/ashok-nagar-anjaneyar-temple.webp'),
  /** Ayyappan Kovil, Mahalingapuram — seed id 28 */
  10028: require('../assets/places/ayyappan-kovil-mahalingapuram.webp'),
  /** Bhakta Anjaneyar Temple, Korattur — seed id 29 */
  10029: require('../assets/places/bhakta-anjaneyar-temple-korattur.webp'),
  /** Kalyana Venkatesa Temple, Mogappair East — seed id 30 */
  10030: require('../assets/places/kalyana-venkateswara-temple-mogappair.webp'),
  /** Ayyappan Temple, K K Nagar — seed id 32 */
  10032: require('../assets/places/ayyappan-temple-kk-nagar.webp'),
  /** Thiruvengadamudaiyan Perumal Temple, Chitlapakkam — seed id 33 */
  10033: require('../assets/places/thiruvengadamudaiyan-perumal-temple-chitlapakkam.webp'),
  /** Mangadu Amman Kovil — seed id 34 */
  10034: require('../assets/places/mangadu-amman-kovil.webp'),
  /** Thaagam Foundation — seed id 35 */
  10035: require('../assets/places/thaagam-foundation.webp'),
  /** Chennai Food Bank (RYA Madras Metro Trust) — seed id 36 */
  10036: require('../assets/places/chennai-food-bank.webp'),
  /** Mother Teresa Foundation (Anbu Illam) — Nobel Laureate MT Charitable Trust / Mother’s Castle, Choolaimedu — seed id 37 */
  10037: require('../assets/places/mother-teresa-charitable-trust-choolaimedu.webp'),
  /** Annai Teresa Foundation (Kilpauk) — seed id 38 */
  10038: require('../assets/places/annai-teresa-foundation-kilpauk.webp'),
  /** Udhavum Ullangal — seed id 40 */
  10040: require('../assets/places/udhavum-ullangal.webp'),
  /** Arunodhaya Centre for Street Children, Chetpet — seed id 41 */
  10041: require('../assets/places/arunodhaya-street-children-centre.webp'),
  /** Pephands Foundation — seed id 44 */
  10044: require('../assets/places/pephands-foundation.webp'),
  /** Robin Hood Army — Chennai Chapter (food rescue) — seed id 46 */
  10046: require('../assets/places/robin-hood-army-chennai.png'),
  /** Amma Unavagam (GCC subsidised canteens) — seed id 47 */
  10047: require('../assets/places/amma-unavagam-canteen.webp'),
  ...GCC_NIGHT_SHELTER_COVERS,
  /** GCC Special Shelter — IOG Egmore (Men Attendants) — stay seed id 44 (`STAY_PLACE_ID_OFFSET` + 44) */
  30044: require('../assets/places/gcc-special-shelter-iog-egmore.png'),
  /** Robin Hood Army Chennai — Clothes Distribution (hygiene seed id 18 → 60_000 + 18) */
  60018: require('../assets/places/robin-hood-army-chennai.png'),
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
