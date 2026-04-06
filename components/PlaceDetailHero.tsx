import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { categoryAccentFill, categoryIconForSlug } from '@/constants/categoryVisuals';
import { elevationSoft } from '@/constants/elevation';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';

const ICON_WELL = 42;
const ICON_SIZE = 20;

type Props = {
  lang: Lang;
  name: string;
  area: string;
  accent: string;
  categorySlug: string;
};

/**
 * Place title block — soft card, circular category badge (not a floating square icon).
 */
export function PlaceDetailHero({ lang, name, area, accent, categorySlug }: Props) {
  const f = useFontFamily(lang);
  const icon = categoryIconForSlug(categorySlug);

  return (
    <View
      style={[
        {
          borderRadius: 18,
          backgroundColor: colors.surfaceCardDark,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(22, 26, 25, 0.07)',
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        elevationSoft,
      ]}
    >
      <View className="flex-row items-start" style={{ gap: 16 }}>
        <View
          style={{
            width: ICON_WELL,
            height: ICON_WELL,
            borderRadius: ICON_WELL / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: categoryAccentFill(accent, '16'),
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: categoryAccentFill(accent, '40'),
            marginTop: 2,
          }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Ionicons name={icon} size={ICON_SIZE} color={accent} />
        </View>

        <View className="min-w-0 flex-1" style={{ paddingTop: 1 }}>
          <Text
            style={{ fontFamily: f.bold }}
            className="text-[24px] leading-[30px] tracking-[-0.35px] text-ink"
            accessibilityRole="header"
          >
            {name}
          </Text>
          <View className="mt-2 flex-row items-start gap-2" style={{ paddingRight: 4 }}>
            <Ionicons
              name="location-outline"
              size={16}
              color={accent}
              style={{ marginTop: 2, opacity: 0.72 }}
            />
            <Text
              style={{ fontFamily: f.medium, color: colors.inkMuted }}
              className="flex-1 text-[15px] leading-[22px]"
            >
              {area}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
