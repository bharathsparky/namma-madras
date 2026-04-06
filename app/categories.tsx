import { router, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoriesHeroIllustration } from '@/components/CategoriesHeroIllustration';
import { CategoryGridPromoCard } from '@/components/CategoryGridPromoCard';
import { EmergencyButton } from '@/components/EmergencyButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getCategories } from '@/db/queries';
import { useLanguageStore } from '@/stores/languageStore';

const SCROLL_PAD_FAB = 80;
/** Matches ScrollView horizontal padding (px-6 = 24). */
const GRID_H_PAD = 24;
const GRID_GAP = 16;

function categoryHref(slug: string): string {
  if (slug === 'emergency') return '/emergency';
  if (slug === 'food') return '/home';
  if (slug === 'stay') return '/hub/stay';
  if (slug === 'medical') return '/hub/medical';
  if (slug === 'learn') return '/hub/learn';
  if (slug === 'work') return '/hub/work';
  if (slug === 'hygiene') return '/hub/hygiene';
  return `/category/${slug}`;
}

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const nav = useRouter();
  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const { width: windowW } = useWindowDimensions();

  const contentW = Math.max(0, windowW - GRID_H_PAD * 2);
  const tileWidth = (contentW - GRID_GAP) / 2;

  const goBack = useCallback(() => {
    if (nav.canGoBack()) nav.back();
    else nav.replace('/home');
  }, [nav]);

  const categories = useMemo(() => getCategories(db), [db]);

  const title = t('tabs.categories');

  return (
    <View className="flex-1 bg-[#F8F7F5]">
      <ScreenHeader
        title={title}
        lang={lang}
        onBackPress={goBack}
        variant="light"
      />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + SCROLL_PAD_FAB + 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <CategoriesHeroIllustration
          lang={lang}
          overline={t('categoriesScreen.heroOverline')}
          title={t('categoriesScreen.heroTitle')}
        />

        {/* Explicit width + gap — RN flex-wrap alone often collapses to one column. */}
        <View
          style={{
            width: contentW,
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: GRID_GAP,
            rowGap: GRID_GAP,
            alignContent: 'flex-start',
          }}
        >
          {categories.map((c) => (
            <View key={c.id} style={{ width: tileWidth }}>
              <CategoryGridPromoCard
                category={c}
                lang={lang}
                tileWidth={tileWidth}
                onPress={() => router.push(categoryHref(c.slug) as never)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <EmergencyButton />
    </View>
  );
}
