import type { TFunction } from 'i18next';
import type { Lang, PlaceRow } from '@/db/types';
import { placeDisplayTiming } from '@/utils/seedLocale';

/** Prefer the active UI language, fall back to the other if empty. */
export function getPrimaryTimingText(place: PlaceRow, lang: Lang, t?: TFunction): string {
  if (lang === 'hi' && t) {
    const hi = placeDisplayTiming(place, 'hi', t)?.trim();
    if (hi) return hi;
  }
  const primary = lang === 'ta' ? place.timing_ta : place.timing_en;
  const fallback = lang === 'ta' ? place.timing_en : place.timing_ta;
  const s = (primary ?? '').trim() || (fallback ?? '').trim();
  return s;
}

function normalizeClockToken(token: string): string {
  let t = token.trim().replace(/\s+/g, ' ').toUpperCase();
  t = t.replace(/:00(\s+(?:AM|PM))$/, '$1');
  return t;
}

function compactNumericTime(h: string, mer: string): string {
  const merU = mer.toUpperCase();
  if (h.includes(':')) {
    const [hr, min] = h.split(':');
    if (min === '00') return `${hr} ${merU}`;
    return `${hr}:${min} ${merU}`;
  }
  return `${h} ${merU}`;
}

/** "4–8:30 PM" — trailing meridiem applies to both ends. */
function extractSharedMeridiemRanges(s: string): string[] {
  const raw = s.replace(/[–—−]/g, '-');
  const re = /\b(\d{1,2}(?::\d{2})?)\s*-\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)\b/gi;
  return [...raw.matchAll(re)].map((m) => {
    const mer = m[3];
    return `${compactNumericTime(m[1], mer)}–${compactNumericTime(m[2], mer)}`;
  });
}

function extractAmPmTokens(s: string): string[] {
  const raw = s.replace(/[–—−]/g, '-');
  const re = /\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/gi;
  const found = raw.match(re);
  if (!found?.length) return [];
  return found.map((x) => normalizeClockToken(x));
}

/** Latin clock fragments e.g. Tamil copy still has "12:30". */
function extractBareClocks(s: string): string | null {
  const matches = s.match(/\b\d{1,2}:\d{2}\b/g);
  if (!matches?.length) return null;
  const uniq = [...new Set(matches)];
  if (uniq.length > 3) return uniq.slice(0, 3).join(' · ');
  return uniq.join(' · ');
}

function isGenericNoClock(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (/\d/.test(t)) return false;
  const lower = t.toLowerCase();
  if (/^daily\.?$/.test(lower)) return true;
  if (/^தினமும்\.?$/.test(t)) return true;
  if (/^தினசரி\.?$/.test(t)) return true;
  if (/^not specified\.?$/i.test(lower)) return true;
  if (t === 'நேரம் குறிப்பிடப்படவில்லை' || t.startsWith('நேரம் குறிப்பிடப்படவில்லை')) return true;
  return false;
}

/** Remove clock-like fragments so narrative (Sunday / festival notes) can be shown on its own line. */
function stripClockLikeContent(s: string): string {
  let t = s.replace(/\s+/g, ' ');
  t = t.replace(/\b\d{1,2}(?::\d{2})?\s*-\s*\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/gi, ' ');
  t = t.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/gi, ' ');
  t = t.replace(/\b\d{1,2}:\d{2}\b/g, ' ');
  t = t.replace(/\b24\s*[\/×x]\s*7\b/gi, ' ');
  /** Stay / lodge copy often repeats “24 hours” next to compact “24/7” — strip as clock-ish noise. */
  t = t.replace(/\b24\s*-?\s*hours?\b/gi, ' ');
  t = t.replace(/\b24\s*hrs?\b/gi, ' ');
  t = t.replace(/\bnoon\b/gi, ' ');
  t = t.replace(/\s*[·\-–—,;]\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}

/**
 * When compact clocks are shown, returns remaining prose (e.g. Sunday / festival).
 * When there are no compact clocks, returns full timing if it is not a generic placeholder.
 */
export function getTimingSupplementBeyondCompact(
  fullTiming: string,
  compactTime: string | null,
): string | null {
  const full = fullTiming.replace(/\s+/g, ' ').trim();
  if (!full) return null;

  if (!compactTime) {
    if (isGenericNoClock(full)) return null;
    return full;
  }

  const stripped = stripClockLikeContent(full);
  if (stripped.length < 4) return null;
  return stripped;
}

/**
 * Short label for list cards: clock times only (e.g. `11:30 AM · 2 PM`, `7 PM`).
 * Returns null if there is no parseable time — omit UI (no generic "Daily" line).
 */
export function getCompactFoodTimeLabel(place: PlaceRow, _lang: Lang): string | null {
  const en = (place.timing_en ?? '').trim();
  const ta = (place.timing_ta ?? '').trim();
  const tryStrings = [en, ta].filter(Boolean);

  for (const block of tryStrings) {
    if (isGenericNoClock(block)) continue;

    const ranges = extractSharedMeridiemRanges(block);
    const tokens = extractAmPmTokens(block);
    const noon = /\bnoon\b/i.test(block) && tokens.length === 0 && ranges.length === 0;

    const parts: string[] = [];
    if (ranges.length) parts.push(...ranges);
    for (const tok of tokens) {
      const contained = ranges.some((r) => r.includes(tok.replace(/\s+/g, ' ')));
      if (!contained) parts.push(tok);
    }
    if (noon) parts.unshift('12 PM');

    if (parts.length > 0) {
      const dedup = parts.filter((p, i, a) => i === 0 || p !== a[i - 1]);
      return dedup.slice(0, 4).join(' · ');
    }

    if (/\b24\s*[\/×x]\s*7\b/i.test(block)) return '24/7';

    const bare = extractBareClocks(block);
    if (bare) return bare;
  }

  return null;
}
