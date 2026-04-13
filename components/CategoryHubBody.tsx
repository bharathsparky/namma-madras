import { router } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { HomeFoodFilterBar, type HomeFoodFilterId } from '@/components/HomeFoodFilterBar';
import { ListSearchButton } from '@/components/ListSearchButton';
import { SectionHeading } from '@/components/SectionHeading';
import type { Lang } from '@/db/types';
import { getCategoryById, getHubCategoryPlaces } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useNavigateToPlace } from '@/hooks/usePlaceNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { buildSortedFoodPlaces, sortFoodPlaceItems, type HomeFoodSortId } from '@/utils/foodPlaceSort';
import { pickTaEn } from '@/utils/pickTaEn';

const SECONDARY_PREVIEW = 5;

type Props = {
  categoryId: number;
  lang: Lang;
  /** i18n prefix, e.g. `home` or `hub.stay` */
  listCopyNs: string;
  listFooter?: ReactNode;
};

/**
 * Shared listing for category hubs: time-aware — “open now” first, everything else de-emphasized below.
 */
export function CategoryHubBody({ categoryId, lang, listCopyNs, listFooter }: Props) {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const f = useFontFamily(lang);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  /** 60s — tier/open-state updates without re-rendering the whole list every 30s. */
  const now = useLiveClock(60000);

  const places = useMemo(
    () => getHubCategoryPlaces(db, categoryId, lat, lon),
    [db, categoryId, lat, lon],
  );

  const sortedPlaces = useMemo(
    () => buildSortedFoodPlaces(places, now, lang),
    [places, now, lang],
  );

  const [placeFilter, setPlaceFilter] = useState<HomeFoodFilterId>('all');
  const [placeSort, setPlaceSort] = useState<HomeFoodSortId>('nearest');
  const [showAllSecondary, setShowAllSecondary] = useState(false);

  useEffect(() => {
    setShowAllSecondary(false);
  }, [placeFilter, placeSort]);

  const baseFiltered = useMemo(() => {
    if (placeFilter === 'all') return sortedPlaces;
    if (placeFilter === 'open_now') return sortedPlaces.filter((x) => x.tier === 0);
    return sortedPlaces;
  }, [sortedPlaces, placeFilter]);

  const primaryPlaces = useMemo(
    () => sortFoodPlaceItems(baseFiltered.filter((x) => x.tier === 0), placeSort, lang),
    [baseFiltered, placeSort, lang],
  );

  const secondaryPlaces = useMemo(
    () => sortFoodPlaceItems(baseFiltered.filter((x) => x.tier !== 0), placeSort, lang),
    [baseFiltered, placeSort, lang],
  );

  const secondaryVisible = useMemo(() => {
    if (showAllSecondary || secondaryPlaces.length <= SECONDARY_PREVIEW) return secondaryPlaces;
    return secondaryPlaces.slice(0, SECONDARY_PREVIEW);
  }, [secondaryPlaces, showAllSecondary]);

  const secondaryMoreCount = secondaryPlaces.length - secondaryVisible.length;

  const k = (key: string) => `${listCopyNs}.${key}`;

  const categoryRow = useMemo(() => getCategoryById(db, categoryId), [db, categoryId]);
  const goToPlace = useNavigateToPlace();

  const toolbarOverline =
    categoryId === 1 ? t('home.foodListToolbarOverline') : t('home.listToolbarOverline');
  const toolbarTitle =
    categoryId === 1 ? t('home.foodListToolbarTitle') : t('home.listToolbarTitle');

  const renderPrimaryCards = () =>
    primaryPlaces.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
      <FoodPlaceCard
        key={place.id}
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
    ));

  const renderSecondaryCards = () =>
    secondaryVisible.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
      <FoodPlaceCard
        key={place.id}
        place={place}
        lang={lang}
        tier={tier}
        dimmed={dimmed}
        distanceKm={distanceKm}
        etaMinutes={etaMinutes}
        deemphasized
        surface="listRow"
        onPress={() => goToPlace(place.id)}
      />
    ));

  return (
    <View className="px-4 pt-5">
      {places.length > 0 ? (
        <View className="gap-3">
          <SectionHeading
            lang={lang}
            overline={toolbarOverline}
            title={toolbarTitle}
            className="mb-0"
            right={
              categoryRow ? (
                <ListSearchButton
                  categoryId={categoryId}
                  accessibilityLabel={t('home.listSearchA11yScoped', {
                    category: pickTaEn(lang, categoryRow.label_ta, categoryRow.label_en),
                  })}
                />
              ) : null
            }
          />
          <HomeFoodFilterBar
            lang={lang}
            selected={placeFilter}
            onSelect={setPlaceFilter}
            selectedSort={placeSort}
            onSelectSort={setPlaceSort}
            filterBarA11yLabel={t(k('filterSortBarA11y'))}
          />
        </View>
      ) : null}

      {places.length > 0 && baseFiltered.length === 0 ? (
        <View className="mt-5 rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t(k('quickFilterEmpty'))}
          </Text>
          <Pressable
            onPress={() => setPlaceFilter('all')}
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

      {places.length > 0 && baseFiltered.length > 0 ? (
        <View className="mt-5">
          {primaryPlaces.length > 0 ? (
            <>
              {/* Food home: toolbar block already introduces the list — skip duplicate “Right now” header. */}
              {categoryId !== 1 ? (
                <SectionHeading
                  lang={lang}
                  overline={t('home.listGoNowOverline')}
                  title={t('home.listGoNowTitle')}
                  className="mb-4"
                />
              ) : null}
              <View className={categoryId === 1 ? 'mt-1' : undefined}>
                {renderPrimaryCards()}
              </View>
            </>
          ) : null}

          {primaryPlaces.length === 0 && secondaryPlaces.length > 0 ? (
            <View className="mb-5 rounded-xl border border-ink/12 bg-ink/[0.04] px-4 py-3">
              <Text style={{ fontFamily: f.medium }} className="text-sm leading-5 text-ink">
                {t('home.listNoOpenBanner')}
              </Text>
            </View>
          ) : null}

          {secondaryPlaces.length > 0 ? (
            <View className={primaryPlaces.length > 0 ? 'mt-8' : ''}>
              {/* Banner already explains “nothing clearly open”; skip duplicate “Not open now” heading. */}
              {primaryPlaces.length > 0 ? (
                <SectionHeading
                  lang={lang}
                  overline={t('home.listLaterOverline')}
                  title={t('home.listLaterTitle')}
                  className="mb-4"
                />
              ) : null}
              {renderSecondaryCards()}
              {secondaryMoreCount > 0 ? (
                <Pressable
                  onPress={() => setShowAllSecondary(true)}
                  className="mt-2 min-h-[48px] justify-center rounded-xl border border-ink/10 bg-surface-inset/80 py-3 active:bg-ink/[0.04]"
                  accessibilityRole="button"
                  accessibilityLabel={t('home.listShowMoreLater', { count: secondaryMoreCount })}
                >
                  <Text style={{ fontFamily: f.medium }} className="text-center text-[15px] text-ink">
                    {t('home.listShowMoreLater', { count: secondaryMoreCount })}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {places.length === 0 ? (
        <View className="mt-5 rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
          <Text style={{ fontFamily: f.regular }} className="text-sm text-ink-muted">
            {t('common.noResults')}
          </Text>
          <Pressable
            onPress={() => router.push('/categories')}
            className="mt-2 min-h-[44px] justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('home.heroBrowseCategories')}
            accessibilityHint={t('a11y.openCategory')}
          >
            <Text style={{ fontFamily: f.medium }} className="text-ink-muted">
              {t('home.heroBrowseCategories')}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {listFooter}
    </View>
  );
}
