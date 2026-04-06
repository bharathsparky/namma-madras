import type { Lang, PlaceRow } from '@/db/types';
import { pickTaEn } from '@/utils/pickTaEn';

/** One-line preview for list cards — first paragraph, trimmed at word boundary. */
export function getFoodDescriptionSnippet(place: PlaceRow, lang: Lang, maxLen = 100): string | null {
  const primary = pickTaEn(lang, place.description_ta ?? '', place.description_en ?? '');
  const fallback = lang === 'ta' ? place.description_en : place.description_ta;
  const raw = (primary ?? '').trim() || (fallback ?? '').trim();
  if (!raw) return null;
  const firstBlock = raw.split(/\n\s*\n/)[0]?.trim() ?? raw;
  const oneLine = firstBlock.replace(/\s+/g, ' ').trim();
  if (oneLine.length <= maxLen) return oneLine;
  const cut = oneLine.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  const base = (lastSpace > 32 ? cut.slice(0, lastSpace) : cut).trim();
  return base ? `${base}…` : null;
}
