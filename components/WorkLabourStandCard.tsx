import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { WorkPlace } from '@/data/seeds/work';
import { listingCardOutline, listingCardShell } from '@/constants/listingCardChrome';
import { colors } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { workDisplayDailyWage, workDisplayName, workDisplayTiming } from '@/utils/seedLocale';
import { formatDistanceAway } from '@/utils/formatDistance';
import { openDirectionsToPlace } from '@/utils/openDirections';
import { useSettingsStore } from '@/stores/settingsStore';
import { WorkPlaceBadges } from '@/components/WorkPlaceBadges';

type Props = {
  place: WorkPlace;
  lang: Lang;
  distanceKm?: number;
};

export function WorkLabourStandCard({ place, lang, distanceKm }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const tamilNumerals = useSettingsStore((s) => s.tamilNumerals);
  const name = workDisplayName(place, lang, t);
  const timing = workDisplayTiming(place, lang, t);
  const wage = workDisplayDailyWage(place, lang, t);

  const distLabel =
    distanceKm != null
      ? formatDistanceAway(distanceKm, lang, tamilNumerals, t)
      : null;

  const hasCoords = place.latitude != null && place.longitude != null;

  const onDirections = () => {
    if (hasCoords) void openDirectionsToPlace(place.latitude!, place.longitude!);
  };

  const a11yLabel = [name, place.area, distLabel, timing].filter(Boolean).join('. ');

  return (
    <View
      className={`mb-4 overflow-hidden rounded-2xl bg-surface-card-dark ${!hasCoords ? 'opacity-88' : ''}`}
      style={listingCardShell(listingCardOutline.work)}
    >
      <Pressable
        onPress={onDirections}
        disabled={!hasCoords}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={hasCoords ? t('hub.work.directionsA11yHint') : undefined}
        accessibilityState={{ disabled: !hasCoords }}
        className={hasCoords ? 'active:bg-ink/[0.03]' : ''}
      >
        <View className="px-4 pt-3.5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text
                style={{ fontFamily: f.bold }}
                className="text-[18px] leading-6 tracking-[-0.2px] text-ink"
                numberOfLines={2}
              >
                {name}
              </Text>
              <Text
                style={{ fontFamily: f.regular }}
                className="mt-1 text-[13px] leading-5 text-ink-muted"
                numberOfLines={1}
              >
                {place.area}
              </Text>
            </View>
            {hasCoords && distLabel ? (
              <View className="mt-0.5 shrink-0 rounded-full border border-ink/14 bg-ink/[0.06] px-2.5 py-1.5">
                <Text style={{ fontFamily: f.medium }} className="text-[12px] leading-4 text-ink-muted">
                  {distLabel}
                </Text>
              </View>
            ) : null}
          </View>

          <WorkPlaceBadges lang={lang} isGovt={place.is_govt} />
        </View>

        <View className="mx-3 mt-1 rounded-xl bg-surface-inset/70 px-3.5 py-3">
          <View>
            <Text
              style={{ fontFamily: f.medium }}
              className="text-[10px] uppercase tracking-[0.12em] text-ink-muted"
            >
              {t('hub.work.gatherTime')}
            </Text>
            <Text style={{ fontFamily: f.regular }} className="mt-1.5 text-[14px] leading-[21px] text-ink/92">
              {timing}
            </Text>
          </View>

          <View className="my-3 h-px bg-ink/[0.07]" />

          <View>
            <Text
              style={{ fontFamily: f.medium }}
              className="text-[10px] uppercase tracking-[0.12em] text-work/90"
            >
              {t('hub.work.typicalWage')}
            </Text>
            <Text style={{ fontFamily: f.medium }} className="mt-1.5 text-[14px] leading-[21px] text-ink">
              {wage}
            </Text>
          </View>
        </View>

        {hasCoords ? (
          <View className="mt-3 flex-row items-center justify-center gap-2 border-t border-ink/[0.07] bg-ink/[0.02] px-4 py-3.5">
            <Ionicons name="navigate" size={18} color={colors.inkMuted} />
            <Text style={{ fontFamily: f.bold }} className="text-[15px] text-ink">
              {t('hub.work.openDirections')}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
