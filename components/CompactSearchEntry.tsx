import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';

type Props = {
  lang: Lang;
  className?: string;
  /** `onDark` — slightly stronger lift when the pill sits on a dark header (home marketplace). */
  tone?: 'lightCanvas' | 'onDark';
};

/**
 * Pill search affordance — opens global search (same behaviour as categories screen).
 */
export function CompactSearchEntry({ lang, className = 'mb-4', tone = 'lightCanvas' }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const shadow =
    tone === 'onDark'
      ? {
          shadowColor: '#020807',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }
      : {
          shadowColor: '#0a0f0c',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        };

  const surfaceClass =
    tone === 'onDark'
      ? 'border border-white/[0.14] bg-[#FFFCFA]'
      : 'border border-ink/[0.08] bg-[#FDFCFB]';

  return (
    <Pressable
      onPress={() => router.push('/search')}
      accessibilityRole="button"
      accessibilityLabel={t('home.heroSearchA11y')}
      accessibilityHint={t('home.heroSearchHint')}
      className={`flex-row items-center gap-3 rounded-2xl px-4 py-3.5 active:opacity-95 ${surfaceClass} ${className}`}
      style={shadow}
    >
      <Ionicons
        name="search-outline"
        size={22}
        color={tone === 'onDark' ? 'rgba(92, 95, 98, 0.72)' : colors.inkFaint}
      />
      <Text
        style={{ fontFamily: f.regular }}
        className="flex-1 text-[15px] leading-[21px] text-ink-muted"
        numberOfLines={1}
      >
        {t('home.heroSearchPlaceholder')}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={tone === 'onDark' ? 'rgba(138, 141, 145, 0.55)' : colors.inkFaint}
      />
    </Pressable>
  );
}
