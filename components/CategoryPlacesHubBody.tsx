import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { MedicalHubFilterBar, type MedicalHubFilterId } from '@/components/MedicalHubFilterBar';
import { ListSearchButton } from '@/components/ListSearchButton';
import { SectionHeading } from '@/components/SectionHeading';
import type { Lang } from '@/db/types';
import { getCategoryById, getHubCategoryPlaces } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useNavigateToPlace } from '@/hooks/usePlaceNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { buildSortedFoodPlaces, sortFoodPlaceItems } from '@/utils/foodPlaceSort';
import { pickTaEn } from '@/utils/pickTaEn';

type Props = {
  categoryId: number;
  lang: Lang;
  listCopyNs: string;
  listFooter?: ReactNode;
};

/**
 * Non-food category hub listing: same row model as food home (`FoodPlaceCard` hub variant,
 * distance-sorted — no food filter bar or tier sections.
 */
export function CategoryPlacesHubBody({ categoryId, lang, listCopyNs, listFooter }: Props) {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const f = useFontFamily(lang);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const now = useLiveClock(60000);

  const [medicalFilter, setMedicalFilter] = useState<MedicalHubFilterId>('all');

  const places = useMemo(
    () => getHubCategoryPlaces(db, categoryId, lat, lon),
    [db, categoryId, lat, lon],
  );

  const filteredPlaces = useMemo(() => {
    if (categoryId !== 3 || medicalFilter === 'all') return places;
    return places.filter((p) => p.sub_category === medicalFilter);
  }, [places, categoryId, medicalFilter]);

  const sortedItems = useMemo(
    () => buildSortedFoodPlaces(filteredPlaces, now, lang),
    [filteredPlaces, now, lang],
  );

  const ordered = useMemo(
    () => sortFoodPlaceItems(sortedItems, 'nearest', lang),
    [sortedItems, lang],
  );

  const k = (key: string) => `${listCopyNs}.${key}`;

  const hubCategoryRow = useMemo(() => getCategoryById(db, categoryId), [db, categoryId]);
  const goToPlace = useNavigateToPlace();

  const showMedicalChrome = categoryId === 3;

  return (
    <View className="gap-4 px-4 pt-5">
      {showMedicalChrome ? (
        <MedicalHubFilterBar lang={lang} selected={medicalFilter} onSelect={setMedicalFilter} />
      ) : null}

      {ordered.length > 0 ? (
        <View className={showMedicalChrome ? '' : 'mt-0'}>
          <SectionHeading
            lang={lang}
            overline={t(k('listOverline'))}
            title={t(k('listTitle'))}
            className="mb-4"
            right={
              hubCategoryRow ? (
                <ListSearchButton
                  categoryId={categoryId}
                  accessibilityLabel={t('home.listSearchA11yScoped', {
                    category: pickTaEn(lang, hubCategoryRow.label_ta, hubCategoryRow.label_en),
                  })}
                />
              ) : null
            }
          />
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
        <View className="mt-5 rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
          <Text style={{ fontFamily: f.regular }} className="text-sm text-ink-muted">
            {t('common.noResults')}
          </Text>
        </View>
      )}

      {listFooter}
    </View>
  );
}
