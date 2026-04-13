import { BlurView, type BlurTint } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';
import { marketplaceBannerGradient } from '@/constants/asphalt';

/**
 * Home marketplace “glass” treatment using **`BlurView` from `expo-blur`**
 * ([`packages/expo-blur`](https://github.com/expo/expo/tree/main/packages/expo-blur),
 * [docs](https://docs.expo.dev/versions/latest/sdk/blur-view/)).
 *
 * - **iOS**: `systemThickMaterialDark` (darker than ultra-thin) + light charcoal veil toward `#222826`.
 * - **Android**: `tint="dark"` + `experimentalBlurMethod="dimezisBlurView"` (default Android path has no real blur).
 * - **Web**: gradient + mesh (no native blur).
 */
const gradientProps = {
  colors: [...marketplaceBannerGradient] as [string, string, ...string[]],
  locations: [0, 0.45, 1] as const,
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
};

/**
 * Subtle charcoal veil — ties blur to `marketplaceBannerGradient` (~#222826) so the bar reads
 * dark (not gray/washed) while blur still shows through. Keep alpha modest so it stays “glass”.
 */
const DARK_CHARCOAL_VEIL = (
  <View
    style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(12, 16, 15, 0.34)' }]}
    pointerEvents="none"
  />
);

/** Ultra-thin reads light; thicker dark materials match warm charcoal marketplace chrome. */
const blurTint: BlurTint =
  Platform.OS === 'ios' ? 'systemThickMaterialDark' : 'dark';

export type MarketplaceGlassVariant = 'liveBlur' | 'mesh';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Hairline border — reads as an unwanted divider between banner segments; default off. */
  showEdgeStroke?: boolean;
  /**
   * `liveBlur` — native `BlurView` (default on iOS/Android). Each instance samples different pixels,
   * so stacked segments can look like different materials.
   * `mesh` — same `marketplaceBannerGradient` + noise as web; identical on every row. Use for
   * split + sticky home banner (greeting | categories | search) so the bar reads as one surface.
   * Web always uses mesh (no native blur).
   */
  variant?: MarketplaceGlassVariant;
};

/** Shared by web and by `variant="mesh"` on native — deterministic, no per-row blur variance. */
function MarketplaceGradientMeshShell({ style, children, showEdgeStroke = false }: Props) {
  return (
    <LinearGradient
      {...gradientProps}
      style={[
        { overflow: 'hidden', position: 'relative' },
        showEdgeStroke
          ? {
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }
          : null,
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFillObject, { opacity: 0.28 }]} pointerEvents="none">
        <BannerGradientNoise variant="marketplace" />
      </View>
      {DARK_CHARCOAL_VEIL}
      {children}
    </LinearGradient>
  );
}

function MarketplaceGlassNative({ style, children, showEdgeStroke = false }: Props) {
  return (
    <BlurView
      intensity={Platform.select({ ios: 88, android: 78 })}
      tint={blurTint}
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      blurReductionFactor={Platform.OS === 'android' ? 5 : undefined}
      style={[
        {
          overflow: 'hidden',
          position: 'relative',
          ...(showEdgeStroke
            ? {
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }
            : null),
        },
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]} pointerEvents="none">
        {DARK_CHARCOAL_VEIL}
      </View>
      {children}
    </BlurView>
  );
}

export function MarketplaceGlassSurface({ variant = 'liveBlur', ...props }: Props) {
  if (Platform.OS === 'web') {
    return <MarketplaceGradientMeshShell {...props} />;
  }
  if (variant === 'mesh') {
    return <MarketplaceGradientMeshShell {...props} />;
  }
  return <MarketplaceGlassNative {...props} />;
}
