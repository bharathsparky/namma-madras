import type { Lang } from '@/db/types';

/** Locale string for `toLocaleTimeString` / formatting. */
export function localeForLang(lang: Lang): string {
  if (lang === 'ta') return 'ta-IN';
  if (lang === 'hi') return 'hi-IN';
  return 'en-IN';
}
