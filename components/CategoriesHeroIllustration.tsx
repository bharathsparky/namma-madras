import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

/** Chennai skyline — flat vector header (Gojek-style wide banner). */
const HERO_IMG = require('../assets/images/categories-hero-chennai-skyline.png');

const HERO_IMG_H = 196;

type Props = {
  lang: Lang;
  overline: string;
  title: string;
};

/**
 * Top promo: panoramic Chennai illustration + copy. Matches Gojek-style
 * “skyline fades into app canvas” — image uses cover; bottom text on warm off-white.
 */
export function CategoriesHeroIllustration({ lang, overline, title }: Props) {
  const f = useFontFamily(lang);

  return (
    <View className="mb-8 w-full overflow-hidden rounded-[24px]">
      <View
        className="overflow-hidden rounded-[24px]"
        style={{ position: 'relative', backgroundColor: '#F0F7FC' }}
      >
        {/* Full-card gradient wash */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <BannerGradientNoise variant="light" />
        </View>

        <View style={{ position: 'relative', zIndex: 1 }}>
          <View style={{ height: HERO_IMG_H, position: 'relative' }}>
            <Image
              source={HERO_IMG}
              style={{ width: '100%', height: HERO_IMG_H }}
              contentFit="cover"
              contentPosition="top"
              transition={220}
              accessibilityRole="image"
              accessibilityLabel={`${overline}. ${title}`}
              accessibilityIgnoresInvertColors
            />
          </View>

          {/* Slight overlap removes subpixel seam between cover art and copy */}
          <View
            style={{
              position: 'relative',
              marginTop: -2,
              paddingTop: 2,
              paddingHorizontal: 16,
              paddingBottom: 18,
            }}
          >
            <View
              style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F8F7F5' }]}
              pointerEvents="none"
            />
            <Text
              style={{ fontFamily: f.regular }}
              className="text-center text-[13px] leading-[20px] text-ink-muted"
            >
              {overline}
            </Text>
            <Text
              style={{ fontFamily: f.bold }}
              className="mt-1 text-center text-[22px] leading-[28px] tracking-[-0.35px] text-ink"
            >
              {title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
