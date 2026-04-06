/**
 * Gentle guidance for Chennai kalyana mandapam / madabam (reception halls).
 *
 * Exact Subha Muhurtham / mukurtham requires panchangam data — we do **not** compute that here.
 * Instead we combine:
 * - approximate Tamil solar month (Chithirai 1 ≈ 14 April) for season & Aadi awareness
 * - day-of-week (weekends & Friday evening see many hall functions)
 * - local hour (meal-adjacent windows)
 */

const MS_PER_DAY = 86_400_000;

/** Tamil months in order from Chithirai (names for UI copy). */
export const TAMIL_MONTHS_EN = [
  'Chithirai',
  'Vaikasi',
  'Aani',
  'Aadi',
  'Avani',
  'Purattasi',
  'Aippasi',
  'Karthikai',
  'Margazhi',
  'Thai',
  'Maasi',
  'Panguni',
] as const;

export const TAMIL_MONTHS_TA = [
  'சித்திரை',
  'வைகாசி',
  'ஆணி',
  'ஆடி',
  'ஆவணி',
  'புரட்டாசி',
  'ஐப்பசி',
  'கார்த்திகை',
  'மார்கழி',
  'தை',
  'மாசி',
  'பங்குனி',
] as const;

/** Chithirai 1 — Tamil New Year (approximate civil anchor for Chennai). */
function chithiraiStartUtc(year: number): Date {
  return new Date(year, 3, 14);
}

/**
 * Approximate Tamil month index 0..11 (Chithirai..Panguni).
 * Uses ~30.44 days per month — good enough for Aadi / Thai season hints, not for panchangam.
 */
export function approxTamilMonthIndex(date: Date): number {
  const y = date.getFullYear();
  let start = chithiraiStartUtc(y);
  if (date.getTime() < start.getTime()) {
    start = chithiraiStartUtc(y - 1);
  }
  const days = Math.floor((date.getTime() - start.getTime()) / MS_PER_DAY);
  const idx = Math.floor(days / 30.436875);
  return Math.min(11, Math.max(0, idx));
}

export function tamilMonthName(lang: 'en' | 'ta', index: number): string {
  const i = Math.min(11, Math.max(0, index));
  return lang === 'ta' ? TAMIL_MONTHS_TA[i] : TAMIL_MONTHS_EN[i];
}

export type ReceptionHallHintKind =
  /** Many families book halls — weekends + meal hours; not Aadi. */
  | 'weekend_meal_window'
  /** Thai / Maasi / Panguni + weekend — peak wedding season (still approximate). */
  | 'wedding_season_weekend'
  /** Aadi month — traditionally fewer weddings; softer note. */
  | 'aadi_note';

export type ReceptionHallHint = {
  kind: ReceptionHallHintKind;
  tamilMonthIndex: number;
};

/**
 * Daytime window when madabam / reception halls may run morning sessions or evening functions (local time).
 * Includes morning (roughly breakfast / prep) through late evening — not overnight.
 */
function inHallHintWindow(hour: number): boolean {
  return hour >= 7 && hour < 22;
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function isFridayEvening(d: Date): boolean {
  return d.getDay() === 5 && d.getHours() >= 17;
}

/**
 * Returns a hint when day/time plausibly align with busy madabam / kalyana mandapam activity.
 * Returns `null` when we have nothing useful to say (e.g. late night, weekday morning).
 */
export function getReceptionHallHint(date = new Date()): ReceptionHallHint | null {
  const hour = date.getHours();
  const monthIdx = approxTamilMonthIndex(date);
  const isAadi = monthIdx === 3;
  const peakWeddingSeason = monthIdx === 9 || monthIdx === 10 || monthIdx === 11; // Thai, Maasi, Panguni

  if (!inHallHintWindow(hour)) {
    return null;
  }

  const socialHallDay = isWeekend(date) || isFridayEvening(date);

  if (isAadi && socialHallDay) {
    return { kind: 'aadi_note', tamilMonthIndex: monthIdx };
  }

  if (!socialHallDay) {
    return null;
  }

  if (isAadi) {
    return null;
  }

  if (peakWeddingSeason) {
    return { kind: 'wedding_season_weekend', tamilMonthIndex: monthIdx };
  }

  return { kind: 'weekend_meal_window', tamilMonthIndex: monthIdx };
}
