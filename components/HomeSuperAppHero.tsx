import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HIT_SLOP_COMFORT } from '@/constants/a11y';
import { homeHero, type SuperAppHeroTheme } from '@/constants/homeHero';
import { colors, ui } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';
import { HeroIllustrationBand } from '@/components/HeroIllustrationBand';
import { useFontFamily } from '@/hooks/useFontFamily';

const DEFAULT_HERO_ILLUSTRATION = require('../assets/images/food-hero-illustration.webp');

/** Top-right icon: search on home, or category grid on hubs / emergency. */
export type HomeHeroQuickAction =
  | {
      mode: 'search';
      onPress: () => void;
      accessibilityLabel: string;
      accessibilityHint: string;
    }
  | {
      mode: 'categories';
      onPress: () => void;
      accessibilityLabel: string;
      accessibilityHint: string;
    };

type Props = {
  lang: Lang;
  greetingLine: string;
  timeLine: string;
  timeAccessibilityLabel: string;
  /** Optional — omitted when empty (e.g. home uses brand title + subtitle only). */
  tagline?: string;
  /** Search / category grid. Omit when the screen provides those elsewhere (e.g. home body search + grid). */
  quickAction?: HomeHeroQuickAction;
  onSettings: () => void;
  settingsLabel: string;
  /** Saved places — primary entry; omit to hide the bookmark control. */
  onSavedPress?: () => void;
  savedA11yLabel?: string;
  savedA11yHint?: string;
  /** Defaults to food home dusk + illustration */
  theme?: SuperAppHeroTheme;
  illustrationSource?: ImageSourcePropType;
  /** `cover` fills the hero strip (e.g. wide medical banner); default matches home (`contain` fit). */
  illustrationResizeMode?: 'contain' | 'cover';
  /** Stack screens (e.g. emergency): back over the illustration, same tap target as `ScreenHeader`. */
  onBackPress?: () => void;
  backA11yLabel?: string;
};

/**
 * Home hero: skyline, dusk panel, greeting + local time (language lives in Settings).
 */
export function HomeSuperAppHero({
  lang,
  greetingLine,
  timeLine,
  timeAccessibilityLabel,
  tagline,
  quickAction,
  onSettings,
  settingsLabel,
  onSavedPress,
  savedA11yLabel,
  savedA11yHint,
  theme: themeProp,
  illustrationSource,
  illustrationResizeMode,
  onBackPress,
  backA11yLabel,
}: Props) {
  const theme: SuperAppHeroTheme = themeProp ?? homeHero;
  const illustration = illustrationSource ?? DEFAULT_HERO_ILLUSTRATION;
  const insets = useSafeAreaInsets();
  const f = useFontFamily(lang);

  const headerA11yLabel = `${greetingLine}, ${timeAccessibilityLabel}`;
  const showPanelTopSeparator = theme.heroPanelTopSeparator ?? true;
  const panelContentPaddingTop = showPanelTopSeparator ? 22 : 18;

  return (
    <View className="overflow-hidden bg-transparent">
      <LinearGradient
        colors={[theme.textPanelDeep, theme.textPanel]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View className="relative w-full">
          {onBackPress ? (
            <Pressable
              onPress={onBackPress}
              hitSlop={HIT_SLOP_COMFORT}
              accessibilityRole="button"
              accessibilityLabel={backA11yLabel ?? ''}
              android_ripple={{ color: ui.heroRippleLight, borderless: true, radius: 28 }}
              style={({ pressed }) => ({
                position: 'absolute',
                left: 12,
                top: insets.top + 2,
                zIndex: 20,
                minHeight: 44,
                minWidth: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: pressed ? theme.iconPressBg : 'transparent',
              })}
            >
              <Ionicons name="chevron-back" size={28} color={colors.onPrimary} />
            </Pressable>
          ) : null}
          <HeroIllustrationBand
            topInset={insets.top}
            theme={theme}
            illustrationSource={illustration}
            illustrationResizeMode={illustrationResizeMode}
          />
        </View>
        <View
          className="relative overflow-hidden px-4 pb-6"
          style={{ marginTop: -1 }}
        >
          <LinearGradient
            colors={[...theme.panelGradient]}
            locations={[0, 0.48, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[...theme.panelAtmosphere]}
            locations={[0, 0.42, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          {/* Mesh + grain on top of base panel so tint stays visible */}
          <BannerGradientNoise variant={theme.bannerNoiseVariant ?? 'dark'} />
          {showPanelTopSeparator ? (
            <LinearGradient
              colors={[...theme.panelTopShade]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 10,
              }}
              pointerEvents="none"
            />
          ) : null}

          <View style={{ paddingTop: panelContentPaddingTop }}>
            <View className="mb-1 flex-row items-start justify-between gap-3">
              <View
                className="min-w-0 flex-1 pr-1"
                accessible
                accessibilityRole="header"
                accessibilityLabel={headerA11yLabel}
              >
                <Text
                  accessibilityElementsHidden
                  style={{
                    fontFamily: f.bold,
                    color: colors.onPrimary,
                    textShadowColor: theme.greetingTextShadow,
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                  className="text-[26px] leading-[31px] tracking-[-0.3px]"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {greetingLine}
                </Text>
                <Text
                  accessibilityElementsHidden
                  style={{
                    fontFamily: f.medium,
                    color: ui.heroTime,
                  }}
                  className="mt-2 text-[15px] leading-[20px]"
                >
                  {timeLine}
                </Text>
              </View>

              <View className="flex-row items-start gap-4">
                {quickAction ? (
                  <Pressable
                    onPress={quickAction.onPress}
                    hitSlop={HIT_SLOP_COMFORT}
                    accessibilityRole="button"
                    accessibilityLabel={quickAction.accessibilityLabel}
                    accessibilityHint={quickAction.accessibilityHint}
                    android_ripple={{ color: ui.heroRippleLight, borderless: true, radius: 28 }}
                    style={({ pressed }) => ({
                      minHeight: 48,
                      minWidth: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 24,
                      backgroundColor: pressed ? theme.iconPressBg : 'transparent',
                    })}
                  >
                    <Ionicons
                      name={quickAction.mode === 'search' ? 'search-outline' : 'grid-outline'}
                      size={24}
                      color={colors.onPrimary}
                    />
                  </Pressable>
                ) : null}
                {onSavedPress && savedA11yLabel ? (
                  <Pressable
                    onPress={onSavedPress}
                    hitSlop={HIT_SLOP_COMFORT}
                    accessibilityRole="button"
                    accessibilityLabel={savedA11yLabel}
                    accessibilityHint={savedA11yHint}
                    android_ripple={{ color: ui.heroRippleLight, borderless: true, radius: 28 }}
                    style={({ pressed }) => ({
                      minHeight: 48,
                      minWidth: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 24,
                      backgroundColor: pressed ? theme.iconPressBg : 'transparent',
                    })}
                  >
                    <Ionicons name="bookmark-outline" size={24} color={colors.onPrimary} />
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={onSettings}
                  hitSlop={HIT_SLOP_COMFORT}
                  accessibilityRole="button"
                  accessibilityLabel={settingsLabel}
                  android_ripple={{ color: ui.heroRippleLight, borderless: true, radius: 28 }}
                  style={({ pressed }) => ({
                    minHeight: 48,
                    minWidth: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 24,
                    backgroundColor: pressed ? theme.iconPressBg : 'transparent',
                  })}
                >
                  <Ionicons name="settings-outline" size={24} color={colors.onPrimary} />
                </Pressable>
              </View>
            </View>

            {tagline?.trim() ? (
              <Text
                style={{ fontFamily: f.medium, color: ui.heroTagline }}
                className="mt-[18px] text-[15px] leading-[23px]"
                numberOfLines={6}
                ellipsizeMode="tail"
              >
                {tagline}
              </Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
