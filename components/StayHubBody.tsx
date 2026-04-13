import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { GccCoordinatorCard } from '@/components/GccCoordinatorCard';
import { SectionHeading } from '@/components/SectionHeading';
import { StayHubFilterBar, type StayCostFilterId } from '@/components/StayHubFilterBar';
import { ListSearchButton } from '@/components/ListSearchButton';
import { getCategoryById, getHubCategoryPlaces } from '@/db/queries';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useNavigateToPlace } from '@/hooks/usePlaceNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { buildSortedFoodPlaces, sortFoodPlaceItems, type HomeFoodSortId } from '@/utils/foodPlaceSort';
import { pickTaEn } from '@/utils/pickTaEn';

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
  const now = useLiveClock(60000);

  const allRows = useMemo(
    () => getHubCategoryPlaces(db, STAY_CATEGORY_ID, lat, lon),
    [db, lat, lon],
  );

  const sortedItems = useMemo(
    () => buildSortedFoodPlaces(allRows, now, lang),
    [allRows, now, lang],
  );

  const [costFilter, setCostFilter] = useState<StayCostFilterId>('all');
  const [placeSort, setPlaceSort] = useState<HomeFoodSortId>('nearest');

  const costFiltered = useMemo(() => {
    if (costFilter === 'all') return sortedItems;
    if (costFilter === 'free') return sortedItems.filter((x) => x.place.cost_type === 'free');
    return sortedItems.filter(
      (x) => x.place.cost_type === 'subsidised' || x.place.cost_type === 'paid',
    );
  }, [sortedItems, costFilter]);

  const ordered = useMemo(
    () => sortFoodPlaceItems(costFiltered, placeSort, lang),
    [costFiltered, placeSort, lang],
  );

  const k = (key: string) => `${listCopyNs}.${key}`;

  const stayCategoryRow = useMemo(() => getCategoryById(db, STAY_CATEGORY_ID), [db]);
  const goToPlace = useNavigateToPlace();

  return (
    <View className="px-4 pb-1 pt-4">
      <GccCoordinatorCard lang={lang} />

      <View className="mt-3 gap-3">
        <SectionHeading
          lang={lang}
          overline={t(k('listOverline'))}
          title={t(k('listTitle'))}
          className="mb-0"
          right={
            stayCategoryRow ? (
              <ListSearchButton
                categoryId={STAY_CATEGORY_ID}
                accessibilityLabel={t('home.listSearchA11yScoped', {
                  category: pickTaEn(lang, stayCategoryRow.label_ta, stayCategoryRow.label_en),
                })}
              />
            ) : null
          }
        />

        <StayHubFilterBar
          lang={lang}
          selectedCost={costFilter}
          onSelectCost={setCostFilter}
          selectedSort={placeSort}
          onSelectSort={setPlaceSort}
        />
      </View>

      {allRows.length > 0 && costFiltered.length === 0 ? (
        <View className="mt-4 rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t(k('quickFilterEmpty'))}
          </Text>
          <Pressable
            onPress={() => setCostFilter('all')}
            className="mt-3 min-h-[44px] justify-center"
            accessibilityRole="button"
            accessibilityLabel={t(k('quickFilterClear'))}
          >
            <Text style={{ fontFamily: f.medium }} className="text-ink-muted">
              {t(k('quickFilterClear'))}
            </Text>
          </Pressable>
        </View>
      ) : null}

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
      ) : allRows.length === 0 ? (
        <View className="rounded-2xl border border-ink/10 bg-surface-card-dark px-4 py-3.5">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t('common.noResults')}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
