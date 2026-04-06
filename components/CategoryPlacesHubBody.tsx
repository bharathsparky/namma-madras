import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { HealthcareSosCard } from '@/components/HealthcareSosCard';
import { MedicalHubFilterBar, type MedicalHubFilterId } from '@/components/MedicalHubFilterBar';
import { SectionHeading } from '@/components/SectionHeading';
import type { Lang } from '@/db/types';
import { getHealthcareSosNumbers, getHubCategoryPlaces } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLocationStore } from '@/stores/locationStore';
import { buildSortedFoodPlaces, sortFoodPlaceItems } from '@/utils/foodPlaceSort';

type Props = {
  categoryId: number;
  lang: Lang;
  listCopyNs: string;
  listFooter?: ReactNode;
};

/**
 * Non-food category hub listing: same **card chrome** as food home (`FoodPlaceCard` hub variant),
 * distance-sorted — no food filter bar or tier sections.
 */
export function CategoryPlacesHubBody({ categoryId, lang, listCopyNs, listFooter }: Props) {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const f = useFontFamily(lang);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const now = useLiveClock(30000);

  const [medicalFilter, setMedicalFilter] = useState<MedicalHubFilterId>('all');

  const places = useMemo(
    () => getHubCategoryPlaces(db, categoryId, lat, lon),
    [db, categoryId, lat, lon],
  );

  const sosRows = useMemo(() => getHealthcareSosNumbers(db), [db]);

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

  const showMedicalChrome = categoryId === 3;

  return (
    <View className="px-4 pt-3">
      {showMedicalChrome ? <HealthcareSosCard lang={lang} rows={sosRows} /> : null}

      {showMedicalChrome ? (
        <MedicalHubFilterBar lang={lang} selected={medicalFilter} onSelect={setMedicalFilter} />
      ) : null}

      {ordered.length > 0 ? (
        <View className={showMedicalChrome ? '' : 'mt-1'}>
          <SectionHeading
            lang={lang}
            overline={t(k('listOverline'))}
            title={t(k('listTitle'))}
            className="mb-4"
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
              onPress={() => router.push(`/place/${place.id}`)}
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
