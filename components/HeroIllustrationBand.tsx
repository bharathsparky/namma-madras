import { Image, type ImageSourcePropType, StyleSheet, View, useWindowDimensions } from 'react-native';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';
import type { SuperAppHeroTheme } from '@/constants/homeHero';

const HERO_ART_HEIGHT = 122;
const HERO_BOTTOM_RADIUS = 0;

type Props = {
  topInset: number;
  theme: SuperAppHeroTheme;
  illustrationSource: ImageSourcePropType;
  illustrationResizeMode?: 'contain' | 'cover';
};

/**
 * Hero art strip: static illustration (no entrance/scale animation — keeps first paint fast).
 */
export function HeroIllustrationBand({
  topInset,
  theme,
  illustrationSource,
  illustrationResizeMode = 'contain',
}: Props) {
  const { width: bandW } = useWindowDimensions();
  const artStripH = theme.illustrationBandArtHeightPx ?? HERO_ART_HEIGHT;
  const totalH = topInset + artStripH;
  const bottomRadius = theme.illustrationBandBottomRadius ?? HERO_BOTTOM_RADIUS;
  const imageAlign = theme.illustrationBandImageAlign ?? 'bottom';
  const meta = Image.resolveAssetSource(illustrationSource);
  const fitted =
    illustrationResizeMode === 'cover'
      ? null
      : meta &&
          typeof meta.width === 'number' &&
          typeof meta.height === 'number' &&
          meta.width > 0 &&
          meta.height > 0
        ? (() => {
            const scaleFit = Math.min(bandW / meta.width, totalH / meta.height);
            return { w: meta.width * scaleFit, h: meta.height * scaleFit };
          })()
        : null;

  const imageInner = (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        {
          justifyContent: imageAlign === 'center' ? 'center' : 'flex-end',
          alignItems: 'center',
        },
      ]}
    >
      <Image
        source={illustrationSource}
        style={
          fitted
            ? { width: fitted.w, height: fitted.h }
            : [StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]
        }
        resizeMode={fitted ? 'contain' : illustrationResizeMode}
        accessibilityIgnoresInvertColors
      />
    </View>
  );

  return (
    <View
      style={{
        width: '100%',
        height: totalH,
        backgroundColor: theme.textPanelDeep,
        borderBottomLeftRadius: bottomRadius,
        borderBottomRightRadius: bottomRadius,
        overflow: 'hidden',
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <BannerGradientNoise variant="dark" />
      {imageInner}
    </View>
  );
}
