import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Lang } from '@/db/types';
import { HIT_SLOP_COMFORT } from '@/constants/a11y';
import { elevationSoft } from '@/constants/elevation';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';

export function ScreenHeader({
  title,
  lang,
  right,
  variant = 'surface',
  children,
  onBackPress,
  /** Tailwind classes for the wrapper around `children` (subtitle). Default `mt-3`. */
  childrenContainerClassName,
}: {
  title: string;
  lang: Lang;
  right?: ReactNode;
  /** `brand` — Asphalt-style green chrome. `light` — warm off-white (e.g. categories promo grid). */
  variant?: 'surface' | 'brand' | 'light';
  children?: ReactNode;
  /** When set, shows a back chevron (stack / sub-screens without tab bar). */
  onBackPress?: () => void;
  childrenContainerClassName?: string;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const f = useFontFamily(lang);
  const brand = variant === 'brand';
  const light = variant === 'light';
  return (
    <View
      className={
        brand
          ? 'z-10 bg-primary px-4 pb-3'
          : light
            ? 'z-10 bg-[#F8F7F5] px-4 pb-3'
            : 'z-10 border-b border-primary/15 bg-surface-dark px-4 pb-4'
      }
      style={
        brand
          ? { paddingTop: Math.max(insets.top, 12) }
          : light
            ? { paddingTop: Math.max(insets.top, 12) }
            : [{ paddingTop: Math.max(insets.top, 12) }, elevationSoft]
      }
    >
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-1">
          {onBackPress ? (
            <Pressable
              onPress={onBackPress}
              hitSlop={HIT_SLOP_COMFORT}
              className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Ionicons
                name="chevron-back"
                size={26}
                color={brand ? colors.onPrimary : colors.ink}
                style={light ? { opacity: 0.92 } : undefined}
              />
            </Pressable>
          ) : null}
          <Text
            style={{ fontFamily: f.bold }}
            className={
              brand
                ? 'min-w-0 flex-1 text-xl tracking-tight text-on-primary'
                : 'min-w-0 flex-1 pr-1 text-xl tracking-tight text-ink'
            }
            numberOfLines={2}
            accessibilityRole="header"
          >
            {title}
          </Text>
        </View>
        {right ? (
          <View className="flex-shrink-0 flex-row items-center gap-1">{right}</View>
        ) : null}
      </View>
      {children ? (
        <View className={childrenContainerClassName ?? 'mt-3'}>{children}</View>
      ) : null}
    </View>
  );
}
