import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CategoryRow, Lang } from '@/db/types';
import {
  categoryAccentFill,
  categoryAccentForSlug,
  categoryIconForSlug,
} from '@/constants/categoryVisuals';
import { categoryTileImageForSlug } from '@/constants/categoryTileImages';
import { elevationSoft, shadowHigh } from '@/constants/elevation';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn } from '@/utils/pickTaEn';

const TILE_RADIUS = 28;
const GRID_IMAGE_ASPECT = 4 / 3;

export function CategoryCard({
  category,
  lang,
  onPress,
  layout = 'grid',
}: {
  category: CategoryRow;
  lang: Lang;
  onPress: () => void;
  /** `grid`: two-column tiles with photo + title below. `list`: full-width rows with icon. */
  layout?: 'grid' | 'list';
}) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const label = pickTaEn(lang, category.label_ta, category.label_en);
  const accent = categoryAccentForSlug(category.slug, category.color_hex);
  const iconName = categoryIconForSlug(category.slug);
  if (layout === 'list') {
    const iconWellBg = categoryAccentFill(accent, '2A');
    return (
      <Pressable
        onPress={onPress}
        className="mb-4 w-full min-h-[60px] flex-row items-center overflow-hidden rounded-[18px] border border-ink/[0.08] bg-surface-card-dark pl-0 active:border-primary/25"
        android_ripple={{ color: ui.ripplePrimary }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={t('a11y.openCategory')}
        style={({ pressed }) => [
          elevationSoft,
          {
            opacity: pressed ? 0.94 : 1,
          },
        ]}
      >
        <View className="w-[3px] self-stretch" style={{ backgroundColor: accent }} />
        <View
          className="ml-3.5 h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconWellBg }}
        >
          <Ionicons name={iconName} size={22} color={accent} />
        </View>
        <Text
          style={{ fontFamily: f.bold }}
          className="ml-3.5 min-w-0 flex-1 pr-2 text-[17px] leading-6 tracking-[-0.2px] text-ink"
          numberOfLines={2}
        >
          {label}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={colors.inkFaint}
          style={{ marginRight: 12, opacity: 0.92 }}
        />
      </Pressable>
    );
  }

  const tileSource = categoryTileImageForSlug(category.slug);

  return (
    <Pressable
      onPress={onPress}
      className="w-full overflow-hidden bg-surface-card-dark active:opacity-92"
      style={[
        {
          borderBottomLeftRadius: TILE_RADIUS,
          borderBottomRightRadius: TILE_RADIUS,
        },
        shadowHigh,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={t('a11y.openCategory')}
    >
      <View
        className="w-full overflow-hidden bg-surface-inset"
        style={{ aspectRatio: GRID_IMAGE_ASPECT }}
      >
        <Image
          source={tileSource}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={180}
          recyclingKey={`category-tile-${category.slug}`}
          accessibilityIgnoresInvertColors
        />
      </View>
      <View className="min-h-[56px] justify-center px-3 py-4">
        <Text
          style={{ fontFamily: f.bold }}
          className="text-center text-[15px] leading-[22px] text-ink"
          numberOfLines={3}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
