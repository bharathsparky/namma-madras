import type { PlaceRow } from '@/db/types';

export type ArrivalHintKey = 'likely' | 'closing_soon' | 'late' | 'before_open' | 'always_open' | 'unknown';

function toMinutes12h(hour12: number, minute: number, ap: string): number {
  const up = ap.toUpperCase();
  if (up === 'AM') {
    if (hour12 === 12) return minute;
    return hour12 * 60 + minute;
  }
  if (hour12 === 12) return 12 * 60 + minute;
  return (hour12 + 12) * 60 + minute;
}

/** First same-day `H:MM AM – H:MM PM` (or hyphen) window found anywhere in the string. */
function parseFirstAmPmWindow(timing: string): { start: number; end: number } | null {
  const re = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–\-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(timing)) !== null) {
    const start = toMinutes12h(parseInt(m[1], 10), parseInt(m[2], 10), m[3]);
    const end = toMinutes12h(parseInt(m[4], 10), parseInt(m[5], 10), m[6]);
    if (end > start) return { start, end };
  }
  return null;
}

/** Ranges like `12:00–1:00 PM` or `4-8:30 PM` (one meridiem for both ends). */
function parseTrailingMeridiemRange(timing: string): { start: number; end: number } | null {
  const raw = timing.replace(/[–—−]/g, '-');
  const re = /\b(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const h1 = parseInt(m[1], 10);
    const min1 = m[2] ? parseInt(m[2], 10) : 0;
    const h2 = parseInt(m[3], 10);
    const min2 = m[4] ? parseInt(m[4], 10) : 0;
    const mer = m[5];
    const start = toMinutes12h(h1, min1, mer);
    const end = toMinutes12h(h2, min2, mer);
    if (end > start) return { start, end };
  }
  return null;
}

function minutesFromMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function getFirstParsedWindow(enRaw: string, taRaw: string): { start: number; end: number } | null {
  const en = enRaw.trim();
  const ta = taRaw.trim();
  return (
    parseFirstAmPmWindow(en) ??
    parseFirstAmPmWindow(ta) ??
    parseTrailingMeridiemRange(en) ??
    parseTrailingMeridiemRange(ta) ??
    null
  );
}

/** Minutes after midnight for the start of the first parseable meal window; `0` for 24/7; `null` if unknown. */
export function getFirstMealWindowStart(place: PlaceRow): number | null {
  const en = (place.timing_en ?? '').trim();
  const ta = (place.timing_ta ?? '').trim();
  const lower = en.toLowerCase();
  if (lower.includes('24/7') || lower.includes('24×7')) return 0;
  const win = getFirstParsedWindow(en, ta);
  return win ? win.start : null;
}

/**
 * Compare estimated arrival (now + travel) to a simple daily window from `timing_en`.
 * Overnight / fuzzy strings → unknown.
 */
export function getArrivalHintKey(place: PlaceRow, travelMinutes: number, now: Date): ArrivalHintKey {
  const en = (place.timing_en ?? '').trim();
  const ta = (place.timing_ta ?? '').trim();
  const lower = en.toLowerCase();
  if (lower.includes('24/7') || lower.includes('24×7')) return 'always_open';

  const win = getFirstParsedWindow(en, ta);
  if (!win) return 'unknown';

  let arrival = minutesFromMidnight(now) + travelMinutes;
  if (arrival >= 24 * 60) arrival -= 24 * 60;

  const bufferEnd = 12;
  const bufferStart = 5;

  if (arrival < win.start - bufferStart) return 'before_open';
  if (arrival > win.end) return 'late';
  if (arrival >= win.end - bufferEnd) return 'closing_soon';
  if (arrival >= win.start) return 'likely';
  return 'before_open';
}
