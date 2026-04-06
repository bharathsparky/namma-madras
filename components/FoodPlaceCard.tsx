import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lang, PlaceRow } from '@/db/types';
import type { PlaceWithDistance } from '@/db/queries';
import {
  CATEGORY_ID_SLUG,
  categoryAccentForSlug,
  categoryGradientForSlug,
  categoryIconForSlug,
} from '@/constants/categoryVisuals';
import { getPlaceCoverSource } from '@/constants/placeCoverAssets';
import { foodPlaceCardOutline, listingCardShell } from '@/constants/listingCardChrome';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useSettingsStore } from '@/stores/settingsStore';
import type { FoodServingTier } from '@/utils/foodPlaceSort';
import { placeDisplayName } from '@/utils/seedLocale';
import { getCompactFoodTimeLabel, getPrimaryTimingText } from '@/utils/placeTimingDisplay';
import { openDirectionsToPlace } from '@/utils/openDirections';
import { formatDistanceAway } from '@/utils/formatDistance';
import { toTamilNumerals } from '@/utils/tamilNumerals';
import { PlaceDeemphasisOverlay } from '@/components/PlaceDeemphasisOverlay';

const THUMB = 88;
const THUMB_RADIUS = 14;
const FOOD_SLUG = 'food';

function statusAccent(tier: FoodServingTier): { label: string; pillBg: string; pillBorder: string } {
  if (tier === 0) {
    return {
      label: colors.badgeOpen,
      pillBg: 'rgba(31, 138, 74, 0.1)',
      pillBorder: 'rgba(31, 138, 74, 0.28)',
    };
  }
  if (tier === 2) {
    return {
      label: colors.badgeClosed,
      pillBg: 'rgba(199, 61, 56, 0.1)',
      pillBorder: 'rgba(199, 61, 56, 0.26)',
    };
  }
  return {
    label: colors.badgeUpcoming,
    pillBg: 'rgba(201, 120, 15, 0.1)',
    pillBorder: 'rgba(201, 120, 15, 0.28)',
  };
}

type Props = {
  place: PlaceRow | PlaceWithDistance;
  lang: Lang;
  tier: FoodServingTier;
  dimmed: boolean;
  distanceKm?: number;
  etaMinutes?: number;
  onPress: () => void;
  /** Frosted veil — “not open now” bucket at bottom of hub lists. */
  deemphasized?: boolean;
  /**
   * `food` — meal-tier copy (home food list).
   * `hub` — generic open/closed; icon/gradient from category.
   */
  variant?: 'food' | 'hub';
};

function shortStatusLabel(
  variant: 'food' | 'hub',
  tier: FoodServingTier,
  place: PlaceRow,
  t: (k: string) => string,
): string {
  if (tier === 0) {
    return variant === 'hub' ? t('common.openNow') : t('home.cardStatusOpen');
  }
  if (tier === 2) {
    return variant === 'hub' ? t('common.closed') : t('home.cardStatusClosed');
  }
  if (place.frequency === 'on_call') return t('home.cardStatusCall');
  return t('home.cardStatusCheck');
}

export function FoodPlaceCard({
  place,
  lang,
  tier,
  dimmed,
  distanceKm,
  etaMinutes,
  onPress,
  deemphasized = false,
  variant = 'food',
}: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const tamilNumerals = useSettingsStore((s) => s.tamilNumerals);
  const [imgFailed, setImgFailed] = useState(false);

  const name = placeDisplayName(place, lang, t);
  const coverSource = getPlaceCoverSource(place);
  const showPhoto = coverSource != null && !imgFailed;

  const hubCategorySlug = CATEGORY_ID_SLUG[place.category_id] ?? 'food';
  const hubFallbackAccent = categoryAccentForSlug(hubCategorySlug, '#2A9B62');

  const [g0, g1] =
    variant === 'hub'
      ? categoryGradientForSlug(hubCategorySlug, hubFallbackAccent)
      : categoryGradientForSlug(FOOD_SLUG, '#C45A2E');
  const fallbackIconName = variant === 'hub' ? categoryIconForSlug(hubCategorySlug) : 'restaurant-outline';

  const compactTime = useMemo(() => getCompactFoodTimeLabel(place, lang), [place, lang]);
  const primaryTiming = useMemo(() => getPrimaryTimingText(place, lang, t), [place, lang, t]);
  /** Single line only — clocks when parseable, else first line of timing (no “notes” / supplement). */
  const timingLine = compactTime ?? (primaryTiming.trim() ? primaryTiming.trim() : null);

  const statusText = shortStatusLabel(variant, tier, place, t);
  const accent = statusAccent(tier);

  let etaPart: string | undefined;
  if (etaMinutes != null) {
    const minPart =
      lang === 'ta' && tamilNumerals ? toTamilNumerals(etaMinutes, 0) : String(etaMinutes);
    etaPart = t('home.cardEtaMins', { minutes: minPart });
  }

  const kmPart =
    distanceKm != null
      ? formatDistanceAway(distanceKm, lang, tamilNumerals, t)
      : undefined;

  const canNavigate = place.latitude != null && place.longitude != null;

  const a11yCostNote =
    place.cost_type === 'free'
      ? null
      : place.cost_type === 'subsidised'
        ? t('common.subsidised')
        : t('common.paid');

  const timingForA11y = timingLine
    ? [timingLine, etaPart].filter(Boolean).join('. ')
    : null;

  const a11yMain = [
    deemphasized && variant === 'food' ? t('home.listDeemphasizedA11yPrefix') : null,
    name,
    statusText,
    timingForA11y,
    place.area,
    kmPart,
    a11yCostNote,
  ]
    .filter(Boolean)
    .join('. ');

  const onDirections = () => {
    if (place.latitude != null && place.longitude != null) {
      void openDirectionsToPlace(place.latitude, place.longitude);
    }
  };

  const cardDeemphasized = variant === 'hub' ? false : deemphasized;

  const locationText = [place.area?.trim(), kmPart].filter(Boolean).join(' · ') || '—';

  return (
    <View
      className="relative mb-3 overflow-hidden rounded-2xl bg-surface-card-dark"
      style={listingCardShell(foodPlaceCardOutline(variant, deemphasized, dimmed))}
    >
      <View style={cardDeemphasized ? { opacity: 0.72 } : undefined}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={a11yMain}
          accessibilityHint={t('a11y.openPlace')}
          className="relative flex-row items-center gap-3 px-3 py-3 active:bg-primary/[0.04]"
        >
          <View
            style={{
              width: THUMB,
              height: THUMB,
              flexShrink: 0,
              borderRadius: THUMB_RADIUS,
              overflow: 'hidden',
              backgroundColor: colors.surfaceInset,
            }}
          >
            {showPhoto && coverSource ? (
              <Image
                source={coverSource}
                style={{ width: THUMB, height: THUMB }}
                contentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={`place-cover-${place.id}`}
                onError={() => setImgFailed(true)}
                accessibilityLabel={name}
                pointerEvents="none"
              />
            ) : (
              <LinearGradient
                colors={[g0, g1]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 0.95, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={fallbackIconName} size={30} color={ui.onHeroIconMuted} />
                </View>
              </LinearGradient>
            )}
          </View>

          <View className="min-w-0 flex-1">
            <Text
              style={{ fontFamily: f.bold }}
              className="text-[17px] leading-[22px] tracking-[-0.28px] text-ink"
              numberOfLines={1}
            >
              {name}
            </Text>

            <View className="mt-2 min-w-0 flex-row items-center gap-2">
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: accent.pillBg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: accent.pillBorder,
                  flexShrink: 0,
                }}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text
                  style={{ fontFamily: f.bold, color: accent.label, fontSize: 11, lineHeight: 14 }}
                  numberOfLines={1}
                >
                  {statusText}
                </Text>
              </View>
              {timingLine ? (
                <View className="min-w-0 flex-1 flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={14} color={colors.primary} style={{ flexShrink: 0 }} />
                  <Text
                    style={{ fontFamily: f.medium, color: ui.captionWarm }}
                    className="min-w-0 flex-1 text-[13px] leading-[17px]"
                    numberOfLines={1}
                  >
                    {timingLine}
                    {etaPart ? (
                      <Text style={{ fontFamily: f.regular, color: colors.inkMuted }}>{` · ${etaPart}`}</Text>
                    ) : null}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mt-1.5 min-w-0 flex-row items-center gap-1.5">
              <Ionicons name="location-outline" size={14} color={colors.inkFaint} style={{ flexShrink: 0, marginTop: 1 }} />
              <Text
                style={{ fontFamily: f.regular }}
                className="min-w-0 flex-1 text-[13px] leading-[17px] text-ink-muted"
                numberOfLines={1}
              >
                {locationText}
              </Text>
              {canNavigate ? (
                <Pressable
                  onPress={onDirections}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('a11y.directionsToPlace', { place: name })}
                  className="h-11 min-w-[44px] flex-shrink-0 flex-row items-center justify-center rounded-xl border border-ink/[0.09] bg-surface-inset/90 active:bg-primary/[0.07] active:opacity-95"
                >
                  <Ionicons name="navigate-outline" size={17} color={colors.primary} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </Pressable>
      </View>
      {cardDeemphasized ? <PlaceDeemphasisOverlay /> : null}
    </View>
  );
}
