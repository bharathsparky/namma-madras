import type { Lang } from '@/db/types';

/** Tamil: Mukta Malar. English: Manrope (Asphalt specifies Maison Neue; Manrope is the bundled stand-in). */
export function useFontFamily(lang: Lang): {
  regular: string;
  medium: string;
  bold: string;
} {
  if (lang === 'ta') {
    return {
      regular: 'MuktaMalar_400Regular',
      medium: 'MuktaMalar_500Medium',
      bold: 'MuktaMalar_700Bold',
    };
  }
  /** English + Hindi: Manrope covers basic Latin; Devanagari falls back to system glyphs. */
  return {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  };
}
