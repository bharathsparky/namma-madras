import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactSearchEntry } from '@/components/CompactSearchEntry';
import { MarketplaceGlassSurface } from '@/components/MarketplaceGlassSurface';
import { HIT_SLOP_COMFORT } from '@/constants/a11y';
import { categoryTileImageForSlug } from '@/constants/categoryTileImages';
import { getCategories } from '@/db/queries';
import type { CategoryRow, Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { colors, ui } from '@/constants/theme';
import { pickTaEn } from '@/utils/pickTaEn';
/** Bottom “scoop” for the marketplace banner — 8px grid × 4; clip wrapper + overflow fixes Android gradient edges. */
const HEADER_BANNER_BOTTOM_RADIUS = 32;
/** Pulls list content slightly under the curve so the arc reads cleanly (no hairline gap). */
const HEADER_BANNER_CURVE_OVERLAP = 8;

const CHIP_GAP = 14;
/**
 * Horizontal strip: larger tiles than the old fixed 78px column (~90px/slot).
 * ~3.85 slots across the viewport ≈ four categories + a peek of the next; a literal 4.5 divisor
 * would shrink columns on phones, so we bias slightly toward bigger chips.
 */
const TARGET_VISIBLE_SLOTS = 3.85;
const H_PAD = 16;
/** Squircle scales with chip width (legacy: 52px @ 78px column). */
function tileAndRadius(chipW: number) {
  const tile = Math.round(Math.min(80, chipW * 0.68));
  const r = Math.max(15, Math.round(tile * 0.31));
  return { tile, squircleR: r };
}

export type MarketplaceChromeLayout = {
  categories: CategoryRow[];
  chipW: number;
  tile: number;
  squircleR: number;
  scrollPadRight: number;
};

/** Shared chip metrics + category rows for marketplace segments. */
export function useMarketplaceChromeLayout(): MarketplaceChromeLayout {
  const db = useSQLiteContext();
  const { width: windowW } = useWindowDimensions();
  const categories = useMemo(() => getCategories(db), [db]);
  return useMemo(() => {
    const viewportForChips = Math.max(0, windowW - H_PAD);
    const slotW = viewportForChips / TARGET_VISIBLE_SLOTS;
    const chipW = Math.round(Math.min(108, Math.max(80, slotW - CHIP_GAP)));
    const { tile, squircleR } = tileAndRadius(chipW);
    const scrollPadRight = Math.max(
      H_PAD,
      windowW - categories.length * (chipW + CHIP_GAP) - H_PAD,
    );
    return { categories, chipW, tile, squircleR, scrollPadRight };
  }, [categories, windowW]);
}

/** `underStatusBar` — apply safe-area top inset in-component (list headers, no SafeAreaView). `belowStatusBar` — parent `SafeAreaView` already insets; use rhythm padding only (avoids overlap with sticky headers). */
export type MarketplaceTopInsetMode = 'underStatusBar' | 'belowStatusBar';

type ChromeBaseProps = {
  lang: Lang;
  activeSlug: string;
  onSelectSlug: (slug: string) => void;
  topInsetMode?: MarketplaceTopInsetMode;
  compactStrip?: boolean;
};

const TOP_RHYTHM = 12;

function topPadding(insets: { top: number }, mode: MarketplaceTopInsetMode | undefined) {
  const m = mode ?? 'underStatusBar';
  return m === 'belowStatusBar' ? TOP_RHYTHM : insets.top + 10;
}

const CategoryChip = memo(function CategoryChip({
  category,
  lang,
  isSelected,
  onSelectSlug,
  chipW,
  tile,
  squircleR,
}: {
  category: CategoryRow;
  lang: Lang;
  isSelected: boolean;
  onSelectSlug: (slug: string) => void;
  chipW: number;
  tile: number;
  squircleR: number;
}) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const label = pickTaEn(lang, category.label_ta, category.label_en);
  const source = categoryTileImageForSlug(category.slug);

  const innerPad = isSelected ? 2 : 0;
  const innerR = isSelected ? Math.max(11, squircleR - 2) : squircleR;
  const innerW = isSelected ? tile - innerPad * 2 : tile;

  const handlePress = useCallback(() => {
    onSelectSlug(category.slug);
  }, [category.slug, onSelectSlug]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={label}
      accessibilityHint={t('a11y.openCategory')}
      style={({ pressed }) => ({
        width: chipW,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <View className="items-center">
        <View
          style={{
            width: tile,
            height: tile,
            borderRadius: squircleR,
            padding: innerPad,
            backgroundColor: isSelected ? ui.chipOnHeroSelectedFill : ui.chipOnHeroUnselectedFill,
            borderWidth: isSelected ? 3 : 1,
            borderColor: isSelected ? colors.chipRingWarm : ui.chipOnHeroBorder,
            shadowColor: isSelected ? '#000000' : 'transparent',
            shadowOffset: { width: 0, height: isSelected ? 3 : 0 },
            shadowOpacity: isSelected ? 0.18 : 0,
            shadowRadius: isSelected ? 6 : 0,
            elevation: isSelected ? 2 : 0,
          }}
        >
          <View
            className="overflow-hidden"
            style={{
              width: innerW,
              height: innerW,
              borderRadius: innerR,
              alignSelf: 'center',
              backgroundColor: isSelected ? colors.selectedSurface : ui.chipOnHeroImageDim,
            }}
          >
            <Image
              source={source}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`chip-${category.slug}`}
              accessibilityIgnoresInvertColors
              transition={0}
            />
          </View>
        </View>
        <Text
          style={{
            fontFamily: f.bold,
            color: isSelected ? colors.onPrimary : ui.chipOnHeroLabelMuted,
          }}
          className="mt-2 text-center text-[11px] leading-[14px]"
          numberOfLines={2}
        >
          {label}
        </Text>
        <View
          className="items-center justify-start"
          style={{ marginTop: 5, height: 4, width: '100%' }}
        >
          {isSelected ? (
            <View
              style={{
                width: 22,
                height: 3,
                borderRadius: 2,
                backgroundColor: ui.chipOnHeroUnderline,
              }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

const chipStripScrollProps = Platform.select({
  android: { overScrollMode: 'never' as const },
  default: {},
});

const marketplaceBannerClipStyle = {
  borderBottomLeftRadius: HEADER_BANNER_BOTTOM_RADIUS,
  borderBottomRightRadius: HEADER_BANNER_BOTTOM_RADIUS,
  overflow: 'hidden' as const,
  ...Platform.select({
    ios: { borderCurve: 'continuous' as const },
    default: {},
  }),
};

/** Greeting row — use as first `ScrollView` child when composing a sticky category strip (index 1). */
export function HomeMarketplaceGreetingBar({
  lang,
  topInsetMode,
  compactStrip,
}: {
  lang: Lang;
  topInsetMode?: MarketplaceTopInsetMode;
  compactStrip?: boolean;
}) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();

  return (
    <MarketplaceGlassSurface
      variant="mesh"
      style={{
        paddingTop: topPadding(insets, topInsetMode),
        paddingBottom: 0,
      }}
    >
      <View className={`flex-row items-center justify-between px-4 ${compactStrip ? 'pb-3' : 'pb-4'}`}>
        <Text
          style={{ fontFamily: f.bold, color: 'rgba(255, 252, 250, 0.96)' }}
          className="max-w-[58%] text-[18px] leading-[23px] tracking-[-0.3px]"
          numberOfLines={1}
          accessibilityRole="header"
        >
          {t('home.greeting')}
        </Text>
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => router.push('/saved')}
            hitSlop={HIT_SLOP_COMFORT}
            accessibilityRole="button"
            accessibilityLabel={t('saved.title')}
            accessibilityHint={t('home.heroSavedA11y')}
            className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:bg-white/10"
          >
            <Ionicons name="bookmark-outline" size={22} color="rgba(255,252,250,0.92)" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={HIT_SLOP_COMFORT}
            accessibilityRole="button"
            accessibilityLabel={t('common.settings')}
            className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:bg-white/10"
          >
            <Ionicons name="settings-outline" size={22} color="rgba(255,252,250,0.92)" />
          </Pressable>
        </View>
      </View>
    </MarketplaceGlassSurface>
  );
}

type StripProps = {
  lang: Lang;
  activeSlug: string;
  onSelectSlug: (slug: string) => void;
  layout: MarketplaceChromeLayout;
  /** Tighter vertical rhythm + subtle elevation when used as sticky header (home). */
  compactStrip?: boolean;
};

/**
 * Category chips row — set `ScrollView` `stickyHeaderIndices={[1]}` with greeting at index 0 and
 * search at index 2 so this row pins under the status bar while scrolling. Uses `variant="mesh"` so
 * each row matches (stacked `BlurView`s sample different pixels and read as mismatched materials).
 */
export const HomeMarketplaceCategoryStrip = memo(function HomeMarketplaceCategoryStrip({
  lang,
  activeSlug,
  onSelectSlug,
  layout,
  compactStrip = false,
}: StripProps) {
  const { categories, chipW, tile, squircleR, scrollPadRight } = layout;
  const chipPadBottom = compactStrip ? 8 : 14;

  return (
    <View
      collapsable={false}
      style={
        compactStrip
          ? {
              ...Platform.select({
                ios: {
                  shadowColor: ui.marketplaceStripShadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                },
                android: { elevation: 2 },
                default: {},
              }),
            }
          : undefined
      }
    >
      <MarketplaceGlassSurface
        variant="mesh"
        style={{
          paddingTop: compactStrip ? 6 : 0,
          paddingBottom: 0,
        }}
      >
        <ScrollView
          horizontal
          nestedScrollEnabled
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          {...chipStripScrollProps}
          contentContainerStyle={{
            paddingLeft: H_PAD,
            paddingRight: scrollPadRight,
            paddingBottom: chipPadBottom,
            gap: CHIP_GAP,
            alignItems: 'flex-start',
          }}
        >
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              category={c}
              lang={lang}
              isSelected={c.slug === activeSlug}
              onSelectSlug={onSelectSlug}
              chipW={chipW}
              tile={tile}
              squircleR={squircleR}
            />
          ))}
        </ScrollView>
      </MarketplaceGlassSurface>
    </View>
  );
});

/** Search row + bottom scoop — last segment of the home marketplace banner. */
export function HomeMarketplaceSearchPanel({ lang }: { lang: Lang }) {
  return (
    <View style={{ marginBottom: -HEADER_BANNER_CURVE_OVERLAP }}>
      <View style={marketplaceBannerClipStyle}>
        <MarketplaceGlassSurface
          variant="mesh"
          style={{
            paddingTop: 4,
            paddingBottom: 20,
          }}
        >
          <View className="px-4 pb-3">
            <CompactSearchEntry lang={lang} className="mb-0" tone="onDark" />
          </View>
        </MarketplaceGlassSurface>
      </View>
    </View>
  );
}

/**
 * Full marketplace block in **one** glass surface (no sticky). Prefer the split exports + sticky
 * header on home when categories should pin while scrolling.
 */
export function HomeMarketplaceChrome({
  lang,
  activeSlug,
  onSelectSlug,
  topInsetMode,
  compactStrip = false,
}: ChromeBaseProps) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const layout = useMarketplaceChromeLayout();
  const { categories, chipW, tile, squircleR, scrollPadRight } = layout;

  const chipPadBottom = compactStrip ? 8 : 14;

  return (
    <View style={{ marginBottom: -HEADER_BANNER_CURVE_OVERLAP }}>
      <View style={marketplaceBannerClipStyle}>
        <MarketplaceGlassSurface
          style={{
            paddingTop: topPadding(insets, topInsetMode),
            paddingBottom: 20,
          }}
        >
          <View className={`flex-row items-center justify-between px-4 ${compactStrip ? 'pb-3' : 'pb-4'}`}>
            <Text
              style={{ fontFamily: f.bold, color: 'rgba(255, 252, 250, 0.96)' }}
              className="max-w-[58%] text-[18px] leading-[23px] tracking-[-0.3px]"
              numberOfLines={1}
              accessibilityRole="header"
            >
              {t('home.greeting')}
            </Text>
            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={() => router.push('/saved')}
                hitSlop={HIT_SLOP_COMFORT}
                accessibilityRole="button"
                accessibilityLabel={t('saved.title')}
                accessibilityHint={t('home.heroSavedA11y')}
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:bg-white/10"
              >
                <Ionicons name="bookmark-outline" size={22} color="rgba(255,252,250,0.92)" />
              </Pressable>
              <Pressable
                onPress={() => router.push('/settings')}
                hitSlop={HIT_SLOP_COMFORT}
                accessibilityRole="button"
                accessibilityLabel={t('common.settings')}
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:bg-white/10"
              >
                <Ionicons name="settings-outline" size={22} color="rgba(255,252,250,0.92)" />
              </Pressable>
            </View>
          </View>

          <View style={compactStrip ? { paddingTop: 6 } : undefined}>
            <ScrollView
              horizontal
              nestedScrollEnabled
              removeClippedSubviews={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              {...chipStripScrollProps}
              contentContainerStyle={{
                paddingLeft: H_PAD,
                paddingRight: scrollPadRight,
                paddingBottom: chipPadBottom,
                gap: CHIP_GAP,
                alignItems: 'flex-start',
              }}
            >
              {categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  lang={lang}
                  isSelected={c.slug === activeSlug}
                  onSelectSlug={onSelectSlug}
                  chipW={chipW}
                  tile={tile}
                  squircleR={squircleR}
                />
              ))}
            </ScrollView>
          </View>

          <View className="px-4 pb-3">
            <CompactSearchEntry lang={lang} className="mb-0" tone="onDark" />
          </View>
        </MarketplaceGlassSurface>
      </View>
    </View>
  );
}
