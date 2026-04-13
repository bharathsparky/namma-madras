import type { Lang } from '@/db/types';

/** Tamil: Mukta Malar. English: Proxima Nova (local assets). Hindi: Manrope (Latin; Devanagari falls back to system). */
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
  if (lang === 'en') {
    return {
      regular: 'ProximaNova_400Regular',
      medium: 'ProximaNova_600SemiBold',
      bold: 'ProximaNova_700Bold',
    };
  }
  return {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  };
}
