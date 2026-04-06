import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { GccCoordinatorCard } from '@/components/GccCoordinatorCard';
import { SectionHeading } from '@/components/SectionHeading';
import { StayRealityBanner } from '@/components/StayRealityBanner';
import { getHubCategoryPlaces } from '@/db/queries';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLocationStore } from '@/stores/locationStore';
import { buildSortedFoodPlaces, sortFoodPlaceItems } from '@/utils/foodPlaceSort';

type Props = {
  lang: Lang;
  listCopyNs: string;
};

const STAY_CATEGORY_ID = 2;

export function StayHubBody({ lang, listCopyNs }: Props) {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const f = useFontFamily(lang);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const now = useLiveClock(30000);

  const allRows = useMemo(
    () => getHubCategoryPlaces(db, STAY_CATEGORY_ID, lat, lon),
    [db, lat, lon],
  );

  const sortedItems = useMemo(
    () => buildSortedFoodPlaces(allRows, now, lang),
    [allRows, now, lang],
  );

  const ordered = useMemo(
    () => sortFoodPlaceItems(sortedItems, 'nearest', lang),
    [sortedItems, lang],
  );

  const k = (key: string) => `${listCopyNs}.${key}`;

  return (
    <View className="px-4 pt-2 pb-1">
      <GccCoordinatorCard lang={lang} />
      <StayRealityBanner lang={lang} />

      <SectionHeading
        lang={lang}
        overline={t(k('listOverline'))}
        title={t(k('listTitle'))}
        className="mb-2 mt-0.5"
      />

      {ordered.length > 0 ? (
        ordered.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
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
            onPress={() => router.push(`/place/${place.id}`)}
          />
        ))
      ) : (
        <View className="rounded-2xl border border-ink/10 bg-surface-card-dark px-4 py-3.5">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t('common.noResults')}
          </Text>
        </View>
      )}
    </View>
  );
}
