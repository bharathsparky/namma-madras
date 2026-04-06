import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { LearnHubFilterBar, type LearnHubFilterId } from '@/components/LearnHubFilterBar';
import { LearnQuickTipCard } from '@/components/LearnQuickTipCard';
import { SectionHeading } from '@/components/SectionHeading';
import { getHubCategoryPlaces } from '@/db/queries';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLocationStore } from '@/stores/locationStore';
import { sortLearnHubPlaces } from '@/utils/learnHubSort';
import { buildSortedFoodPlaces, sortFoodPlaceItems } from '@/utils/foodPlaceSort';

const LEARN_CATEGORY_ID = 7;

type Props = {
  lang: Lang;
  listCopyNs: string;
};

/**
 * Learn hub: pinned quick tip + filterable place list from SQLite (libraries, padaippagam, coaching, …).
 */
export function LearnHubBody({ lang, listCopyNs }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const db = useSQLiteContext();
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const now = useLiveClock(30000);
  const [learnFilter, setLearnFilter] = useState<LearnHubFilterId>('all');

  const places = useMemo(
    () => getHubCategoryPlaces(db, LEARN_CATEGORY_ID, lat, lon),
    [db, lat, lon],
  );

  const filteredPlaces = useMemo(() => {
    if (learnFilter === 'all') return places;
    return places.filter((p) => p.sub_category === learnFilter);
  }, [places, learnFilter]);

  const sortedItems = useMemo(
    () => buildSortedFoodPlaces(filteredPlaces, now, lang),
    [filteredPlaces, now, lang],
  );

  const ordered = useMemo(
    () =>
      sortLearnHubPlaces(sortFoodPlaceItems(sortedItems, 'nearest', lang), lang),
    [sortedItems, lang],
  );

  const k = (key: string) => `${listCopyNs}.${key}`;

  return (
    <View className="px-4 pt-3 pb-1">
      <LearnQuickTipCard lang={lang} />

      <SectionHeading
        lang={lang}
        overline={t(k('listOverline'))}
        title={t(k('listTitle'))}
        className="mb-3 mt-1"
      />
      <LearnHubFilterBar lang={lang} selected={learnFilter} onSelect={setLearnFilter} />

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
        <View className="mt-1 rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3.5">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t(k('placesEmpty'))}
          </Text>
        </View>
      )}
    </View>
  );
}
