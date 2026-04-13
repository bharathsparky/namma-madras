import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FoodPlaceCard } from '@/components/FoodPlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import type { PlaceRow } from '@/db/types';
import { getPlaceById, getSavedPlaceIds } from '@/db/queries';
import { colors } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useLiveClock } from '@/hooks/useLiveClock';
import { hubPlaceCardRows } from '@/utils/hubPlaceCardRows';

export default function SavedScreen() {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);

  const ids = useMemo(() => getSavedPlaceIds(db), [db]);
  const places = useMemo(
    () => ids.map((id) => getPlaceById(db, id)).filter(Boolean) as PlaceRow[],
    [db, ids],
  );

  const savedRows = useMemo(
    () => hubPlaceCardRows(places, now, lang, 'name'),
    [places, now, lang],
  );

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title={t('saved.title')}
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
        {places.length === 0 ? (
          <Text className="mt-4 text-base text-ink-muted">{t('saved.empty')}</Text>
        ) : (
          savedRows.map(({ place, tier, dimmed, distanceKm, etaMinutes }) => (
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
          ))
        )}
      </ScrollView>
    </View>
  );
}
