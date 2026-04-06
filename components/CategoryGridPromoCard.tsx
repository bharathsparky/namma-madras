import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CategoryRow, Lang } from '@/db/types';
import { categoryTileImageForSlug } from '@/constants/categoryTileImages';
import { promoCategoryCardShadow } from '@/constants/elevation';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn } from '@/utils/pickTaEn';

const CARD_RADIUS = 16;
/** Compact CTA — fits narrow two-column tiles without dominating the label. */
const FAB_SIZE = 32;
const ARROW_ICON_SIZE = 15;
/** Square art — illustration fills via cover (slight zoom / crop edges). */
const IMAGE_ASPECT = 1;

const ACCENT_CTA_SLUGS = new Set(['food', 'emergency']);

type Props = {
  category: CategoryRow;
  lang: Lang;
  tileWidth: number;
  onPress: () => void;
};

export function CategoryGridPromoCard({ category, lang, tileWidth, onPress }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const label = pickTaEn(lang, category.label_ta, category.label_en);
  const slug = category.slug;
  const tileSource = categoryTileImageForSlug(slug);
  const ctaBg = ACCENT_CTA_SLUGS.has(slug) ? colors.accent : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={t('a11y.openCategory')}
      android_ripple={{ color: ui.ripplePrimary }}
      style={({ pressed }) => [{ width: tileWidth, opacity: pressed ? 0.96 : 1 }]}
    >
      {/* Shadow + radius on outer shell — inner uses overflow:hidden so iOS shadow is not clipped. */}
      <View
        style={[
          {
            width: '100%',
            borderRadius: CARD_RADIUS,
            backgroundColor: colors.surfaceCardDark,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(22, 26, 25, 0.08)',
          },
          promoCategoryCardShadow,
        ]}
      >
        <View
          style={{
            borderRadius: CARD_RADIUS,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}
        >
          <View
            style={{
              width: '100%',
              aspectRatio: IMAGE_ASPECT,
              backgroundColor: '#F4F6F5',
            }}
          >
            <Image
              source={tileSource}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              contentPosition="center"
              transition={200}
              recyclingKey={`category-promo-${slug}`}
              accessibilityIgnoresInvertColors
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingTop: 8,
              paddingBottom: 10,
              gap: 6,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text
              style={{ fontFamily: f.bold }}
              className="min-w-0 flex-1 text-left text-[14px] leading-[19px] tracking-[-0.2px] text-ink"
              numberOfLines={2}
            >
              {label}
            </Text>
            <View
              style={{
                width: FAB_SIZE,
                height: FAB_SIZE,
                minWidth: FAB_SIZE,
                minHeight: FAB_SIZE,
                borderRadius: FAB_SIZE / 2,
                backgroundColor: ctaBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              accessibilityElementsHidden
            >
              <Ionicons
                name="arrow-forward"
                size={ARROW_ICON_SIZE}
                color={colors.onPrimary}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
