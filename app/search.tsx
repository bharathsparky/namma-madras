import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, ui } from '@/constants/theme';
import { getCategoryById, searchPlacesSortedByDistance } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLanguageStore } from '@/stores/languageStore';
import { hubPlaceCardRows } from '@/utils/hubPlaceCardRows';
import { useLocationStore } from '@/stores/locationStore';
import { pickTaEn } from '@/utils/pickTaEn';

function parseSearchQ(raw: string | string[] | undefined): string {
  if (raw == null) return '';
  return Array.isArray(raw) ? (raw[0] ?? '') : raw;
}

function parseCategoryIdParam(raw: string | string[] | undefined): number | null {
  if (raw == null) return null;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(String(s), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function SearchScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ q?: string | string[]; categoryId?: string | string[] }>();
  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.language);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const [query, setQuery] = useState(() => parseSearchQ(params.q));

  const categoryId = useMemo(() => parseCategoryIdParam(params.categoryId), [params.categoryId]);
  const categoryRow = useMemo(
    () => (categoryId != null ? getCategoryById(db, categoryId) : null),
    [db, categoryId],
  );
  const categoryLabel = categoryRow
    ? pickTaEn(lang, categoryRow.label_ta, categoryRow.label_en)
    : null;

  useEffect(() => {
    const next = parseSearchQ(params.q);
    if (next) setQuery(next);
  }, [params.q]);

  const trimmed = query.trim();
  /** Defers SQLite work so rapid typing does not run a query every keystroke. */
  const deferredQuery = useDeferredValue(trimmed);
  const results = useMemo(
    () =>
      deferredQuery
        ? searchPlacesSortedByDistance(db, deferredQuery, lat, lon, categoryId)
        : [],
    [db, deferredQuery, lat, lon, categoryId],
  );

  const resultRows = useMemo(
    () => (trimmed ? hubPlaceCardRows(results, now, lang, 'nearest') : []),
    [trimmed, results, now, lang],
  );

  const placeholder = categoryLabel
    ? t('searchScreen.placeholderInCategory', { category: categoryLabel })
    : t('home.heroSearchPlaceholder');

  const emptyHint = categoryLabel
    ? t('searchScreen.emptyHintInCategory', { category: categoryLabel })
    : t('searchScreen.emptyHint');

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title={t('common.search')}
        lang={lang}
        right={
          <Pressable
            onPress={() => router.back()}
            className="min-h-[48px] min-w-[48px] items-center justify-center rounded-full active:bg-ink/[0.05]"
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Ionicons name="close" size={26} color={colors.inkMuted} />
          </Pressable>
        }
      />

      {categoryLabel ? (
        <View className="px-4 pb-1 pt-1">
          <Text style={{ fontFamily: f.medium }} className="text-[13px] leading-5 text-ink-muted">
            {t('searchScreen.scopedBanner', { category: categoryLabel })}
          </Text>
        </View>
      ) : null}

      <View className="px-4 pb-2">
        <View className="flex-row items-center rounded-xl border border-ink/[0.08] bg-surface-card-dark px-3">
          <Ionicons name="search-outline" size={22} color={colors.inkFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={ui.placeholderMuted}
            className="min-h-[50px] flex-1 py-3 pl-2.5 text-[16px] text-ink"
            style={{ fontFamily: f.regular }}
            accessibilityLabel={t('a11y.searchField')}
            accessibilityHint={categoryLabel ? t('searchScreen.scopedSearchHint', { category: categoryLabel }) : t('a11y.searchHint')}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoFocus
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 28, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!trimmed ? (
          <Text style={{ fontFamily: f.regular }} className="mt-2 text-[14px] leading-[21px] text-ink-muted">
            {emptyHint}
          </Text>
        ) : (
          <>
            <Text style={{ fontFamily: f.medium }} className="mb-3 text-[13px] text-ink-faint">
              {t('searchScreen.resultsLabel')}
            </Text>
            {resultRows.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
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
            {results.length === 0 ? (
              <Text style={{ fontFamily: f.regular }} className="text-[14px] leading-5 text-ink-muted">
                {t('common.noResults')}
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
