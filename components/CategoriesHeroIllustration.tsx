import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';

/** Chennai skyline — flat vector header (Gojek-style wide banner). */
const HERO_IMG = require('../assets/images/categories-hero-chennai-skyline.webp');

const HERO_IMG_H = 168;

/**
 * Top banner: panoramic Chennai illustration only (no marketing copy).
 */
export function CategoriesHeroIllustration() {
  const { t } = useTranslation();

  return (
    <View className="mb-4 w-full overflow-hidden rounded-[24px]">
      <View
        className="overflow-hidden rounded-[24px]"
        style={{ position: 'relative', backgroundColor: '#F0F7FC' }}
      >
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <BannerGradientNoise variant="light" />
        </View>

        <View style={{ position: 'relative', zIndex: 1 }}>
          <Image
            source={HERO_IMG}
            style={{ width: '100%', height: HERO_IMG_H }}
            contentFit="cover"
            contentPosition="top"
            transition={220}
            accessibilityRole="image"
            accessibilityLabel={t('categoriesScreen.heroImageA11y')}
            accessibilityIgnoresInvertColors
          />
        </View>
      </View>
    </View>
  );
}
