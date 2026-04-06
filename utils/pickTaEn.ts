import type { Lang } from '@/db/types';

/** Rows with Tamil + English fields; Hindi uses English text. */
export function pickTaEn<T>(lang: Lang, ta: T, en: T): T {
  if (lang === 'ta') return ta;
  return en;
}

/** Tamil / English / Hindi — falls back to English when `hi` is missing. */
export function pickTaEnHi(lang: Lang, ta: string, en: string, hi?: string): string {
  if (lang === 'ta') return ta;
  if (lang === 'hi') return (hi?.trim() ? hi : en) ?? en;
  return en;
}
