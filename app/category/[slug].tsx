import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MedicalMentalHealthBanner } from '@/components/MedicalMentalHealthBanner';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WorkRightsBanner } from '@/components/WorkRightsBanner';
import { getCategoryBySlug, getPlacesByCategory } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLanguageStore } from '@/stores/languageStore';
import { colors } from '@/constants/theme';
import { normalizeRouteSlugParam } from '@/utils/routeSlug';
import { pickTaEn } from '@/utils/pickTaEn';
import { FILTER_PILL_SQUIRCLE } from '@/constants/listToolbar';
import { hubPlaceCardRows } from '@/utils/hubPlaceCardRows';

export default function CategorySlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const s = normalizeRouteSlugParam(slug);
  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const [freeOnly, setFreeOnly] = useState(false);

  const category = useMemo(() => getCategoryBySlug(db, s), [db, s]);
  const places = useMemo(
    () => (category ? getPlacesByCategory(db, category.id, { costFreeOnly: freeOnly }) : []),
    [db, category, freeOnly],
  );

  const placeRows = useMemo(
    () => (places.length > 0 ? hubPlaceCardRows(places, now, lang, 'nearest') : []),
    [places, now, lang],
  );

  if (s === 'food') {
    return <Redirect href="/home" />;
  }
  if (s === 'stay') {
    return <Redirect href="/hub/stay" />;
  }
  if (s === 'medical') {
    return <Redirect href="/hub/medical" />;
  }
  if (s === 'learn') {
    return <Redirect href="/hub/learn" />;
  }
  if (s === 'work') {
    return <Redirect href="/hub/work" />;
  }

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-transparent">
        <Text className="text-base text-ink-muted">{t('categoriesScreen.unknownCategory')}</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-ink">{t('common.back')}</Text>
        </Pressable>
      </View>
    );
  }

  const title = pickTaEn(lang, category.label_ta, category.label_en);

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title={title}
        lang={lang}
        right={
          <Pressable onPress={() => router.back()} className="min-h-[48px] min-w-[48px] items-center justify-center">
            <Ionicons name="close" size={26} color={colors.inkMuted} />
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {category.id === 3 ? <MedicalMentalHealthBanner lang={lang} /> : null}
        {category.id === 5 ? <WorkRightsBanner lang={lang} /> : null}

        {(category.slug === 'food' || category.slug === 'stay') && (
          <View className="mt-3 flex-row gap-3">
            <Pressable
              onPress={() => setFreeOnly(false)}
              style={FILTER_PILL_SQUIRCLE}
              className={`min-h-[44px] flex-1 items-center justify-center overflow-hidden border px-2 ${
                !freeOnly ? 'border-ink/22 bg-ink/[0.08]' : 'border-ink/12'
              }`}
            >
              <Text style={{ fontFamily: f.medium }} className="text-sm text-ink/86">
                {t('home.quickFilter.all')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFreeOnly(true)}
              style={FILTER_PILL_SQUIRCLE}
              className={`min-h-[44px] flex-1 items-center justify-center overflow-hidden border px-2 ${
                freeOnly ? 'border-ink/22 bg-ink/[0.08]' : 'border-ink/12'
              }`}
            >
              <Text style={{ fontFamily: f.medium }} className="text-sm text-ink/86">
                {t('common.free')}
              </Text>
            </Pressable>
          </View>
        )}

        {placeRows.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
          <FoodPlaceCard
            key={place.id}
            variant="hub"
            place={place}
            lang={lang}
            tier={tier}
            dimmed={dimmed}
            distanceKm={distanceKm}
            etaMinutes={etaMinutes}
            deemphasized={false}
            surface="listRow"
            onPress={() => router.push(`/place/${place.id}`)}
          />
        ))}
        {places.length === 0 ? (
          <Text style={{ fontFamily: f.regular }} className="mt-4 text-sm text-ink-muted">
            {t('common.noResults')}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
