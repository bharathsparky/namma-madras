/**
 * Place detail screen — vertical rhythm on 8px grid (Tailwind: 1 = 4px).
 * Use these values when adding new blocks so spacing stays consistent.
 */
export const PLACE_DETAIL = {
  /** Scroll horizontal inset (px-6) */
  scrollPaddingX: 24,
  /** Space above title card (below nav) */
  heroTop: 16,
  /** Hero card → cover image */
  afterHero: 24,
  /** Cover → status chips */
  afterCover: 16,
  /** Between editorial sections (PlaceDetailSection) */
  section: 32,
  /** Section overline → body */
  sectionLabelBottom: 8,
} as const;
