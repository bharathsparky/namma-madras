import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { LearnHubFilterBar, type LearnHubFilterId } from '@/components/LearnHubFilterBar';
import { LearnQuickTipCard } from '@/components/LearnQuickTipCard';
import { ListSearchButton } from '@/components/ListSearchButton';
import { SectionHeading } from '@/components/SectionHeading';
import { getCategoryById, getHubCategoryPlaces } from '@/db/queries';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useNavigateToPlace } from '@/hooks/usePlaceNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { sortLearnHubPlaces } from '@/utils/learnHubSort';
import { buildSortedFoodPlaces, sortFoodPlaceItems } from '@/utils/foodPlaceSort';
import { pickTaEn } from '@/utils/pickTaEn';

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
  const now = useLiveClock(60000);
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

  const learnCategoryRow = useMemo(() => getCategoryById(db, LEARN_CATEGORY_ID), [db]);
  const goToPlace = useNavigateToPlace();

  return (
    <View className="px-4 pb-1 pt-5">
      <View className="gap-4">
        <LearnQuickTipCard lang={lang} />

        <View className="gap-3">
          <SectionHeading
            lang={lang}
            overline={t(k('listOverline'))}
            title={t(k('listTitle'))}
            className="mb-0"
            right={
              learnCategoryRow ? (
                <ListSearchButton
                  categoryId={LEARN_CATEGORY_ID}
                  accessibilityLabel={t('home.listSearchA11yScoped', {
                    category: pickTaEn(lang, learnCategoryRow.label_ta, learnCategoryRow.label_en),
                  })}
                />
              ) : null
            }
          />
          <LearnHubFilterBar lang={lang} selected={learnFilter} onSelect={setLearnFilter} />
        </View>
      </View>

      {ordered.length > 0 ? (
        <View className="mt-4">
          {ordered.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
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
              onPress={() => goToPlace(place.id)}
            />
          ))}
        </View>
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
