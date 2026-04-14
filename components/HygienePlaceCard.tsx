import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { HYGIENE_NOTES } from '@/data/seeds/hygiene';
import { categoryGradientForSlug, categoryIconForSlug } from '@/constants/categoryVisuals';
import { getPlaceCoverSource } from '@/constants/placeCoverAssets';
import { foodPlaceListRowDivider } from '@/constants/listingCardChrome';
import { warmShadowKey } from '@/constants/asphalt';
import { colors, onboarding, ui } from '@/constants/theme';
import type { Lang, PlaceRow } from '@/db/types';
import { distanceKmIfPresent } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn, pickTaEnHi } from '@/utils/pickTaEn';
import { placeDisplayName, placeDisplayTiming } from '@/utils/seedLocale';
import { openDirectionsToPlace } from '@/utils/openDirections';

const THUMB = 88;
const THUMB_RADIUS = 14;
const HYGIENE_SLUG = 'hygiene';
const TEAL = onboarding.teal;

function telHref(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d ? `tel:${d}` : '';
}

function openPlace(id: number) {
  router.push(`/place/${id}`);
}

type Props = {
  place: PlaceRow;
  lang: Lang;
};

export function HygienePlaceCard({ place, lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const [imgFailed, setImgFailed] = useState(false);

  const name = placeDisplayName(place, lang, t);
  const timing =
    placeDisplayTiming(place, lang, t) ?? pickTaEn(lang, place.timing_ta ?? '', place.timing_en ?? '');
  const isToilet = place.sub_category === 'hygiene_toilet';
  const isBarber = place.sub_category === 'hygiene_barber' || place.access_type === 'barber';
  const dist = distanceKmIfPresent(place);

  const costFree = place.cost_type === 'free';
  const costNominal = place.cost_type === 'subsidised';
  const womenOnly = place.gender_access === 'women';

  const walkInBody = pickTaEnHi(
    lang,
    HYGIENE_NOTES.barber_walkin_note.ta,
    HYGIENE_NOTES.barber_walkin_note.en,
    HYGIENE_NOTES.barber_walkin_note.hi,
  );

  const primaryPhone = place.contact_phone?.trim();
  const showVenuePhone =
    isToilet && primaryPhone && primaryPhone.replace(/\D/g, '') !== '1913';

  const coverSource = getPlaceCoverSource(place);
  const showPhoto = coverSource != null && !imgFailed;
  const [g0, g1] = categoryGradientForSlug(HYGIENE_SLUG, colors.hygiene);
  const fallbackIcon = categoryIconForSlug(HYGIENE_SLUG);

  const canNavigate = place.latitude != null && place.longitude != null;

  const onDirections = () => {
    if (place.latitude != null && place.longitude != null) {
      void openDirectionsToPlace(place.latitude, place.longitude);
    }
  };

  const metaLine = [place.area?.trim(), timing].filter(Boolean).join(' · ') || '—';

  const a11yMain = useMemo(
    () =>
      [
        name,
        costFree ? t('hub.hygiene.badgeFree') : costNominal ? t('hub.hygiene.badgeNominal') : t('hub.hygiene.badgePaid'),
        womenOnly ? t('hub.hygiene.badgeWomenOnly') : null,
        metaLine !== '—' ? metaLine : null,
        dist != null ? t('common.distanceKmAway', { km: dist.toFixed(1) }) : null,
      ]
        .filter(Boolean)
        .join('. '),
    [name, costFree, costNominal, womenOnly, metaLine, dist, t],
  );

  return (
    <View className="relative overflow-hidden bg-surface-dark" style={foodPlaceListRowDivider}>
      <Pressable
        onPress={() => openPlace(place.id)}
        accessibilityRole="button"
        accessibilityLabel={a11yMain}
        accessibilityHint={t('a11y.openPlace')}
        className="relative flex-row items-center gap-3 px-3 py-3.5 active:bg-ink/[0.04]"
      >
        <View
          style={{
            width: THUMB,
            height: THUMB,
            flexShrink: 0,
            borderRadius: THUMB_RADIUS,
            overflow: 'hidden',
            backgroundColor: colors.surfaceInset,
            ...Platform.select({
              ios: {
                shadowColor: warmShadowKey,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              },
              android: { elevation: 4 },
              default: {},
            }),
          }}
        >
          {showPhoto && coverSource ? (
            <Image
              source={coverSource}
              style={{ width: THUMB, height: THUMB }}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`hygiene-cover-${place.id}`}
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
                <Ionicons name={fallbackIcon} size={30} color={ui.onHeroIconMuted} />
              </View>
            </LinearGradient>
          )}
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap gap-2">
            {costFree ? (
              <View className="rounded-full bg-badgeOpen/18 px-2.5 py-0.5">
                <Text
                  style={{ fontFamily: f.bold, color: colors.badgeOpen }}
                  className="text-[11px] uppercase tracking-wide"
                >
                  {t('hub.hygiene.badgeFree')}
                </Text>
              </View>
            ) : null}
            {costNominal ? (
              <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: ui.badgeSubsidisedWash }}>
                <Text
                  style={{ fontFamily: f.bold, color: colors.badgeSubsidised }}
                  className="text-[11px] uppercase tracking-wide"
                >
                  {t('hub.hygiene.badgeNominal')}
                </Text>
              </View>
            ) : null}
            {!costFree && !costNominal ? (
              <View className="rounded-full bg-ink/10 px-2.5 py-0.5">
                <Text
                  style={{ fontFamily: f.bold }}
                  className="text-[11px] uppercase tracking-wide text-ink-muted"
                >
                  {t('hub.hygiene.badgePaid')}
                </Text>
              </View>
            ) : null}
            {womenOnly ? (
              <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: ui.badgeWomenOnlyWash }}>
                <Text
                  style={{ fontFamily: f.bold }}
                  className="text-[11px] uppercase tracking-wide text-pink-700"
                >
                  {t('hub.hygiene.badgeWomenOnly')}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={{ fontFamily: f.bold }}
            className="mt-2 text-[17px] leading-[22px] tracking-[-0.28px] text-ink"
            numberOfLines={2}
          >
            {name}
          </Text>

          <View className="mt-1.5 min-w-0 flex-row items-start gap-1.5">
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.inkFaint}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <Text
              style={{ fontFamily: f.regular }}
              className="min-w-0 flex-1 text-[13px] leading-[17px] text-ink-muted"
              numberOfLines={2}
            >
              {metaLine}
            </Text>
          </View>

          {dist != null ? (
            <Text style={{ fontFamily: f.medium }} className="mt-1 text-xs text-ink-faint">
              {t('common.distanceKmAway', { km: dist.toFixed(1) })}
            </Text>
          ) : null}

          {isBarber ? (
            <View className="mt-2 rounded-xl border border-ink/12 bg-ink/[0.04] px-3 py-2">
              <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-wide text-ink-muted">
                {t('hub.hygiene.barberWalkinTitle')}
              </Text>
              <Text
                style={{ fontFamily: f.regular }}
                className="mt-1 text-[13px] leading-[20px] text-ink"
                numberOfLines={3}
              >
                {walkInBody}
              </Text>
            </View>
          ) : null}
        </View>

        {canNavigate ? (
          <Pressable
            onPress={onDirections}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.directionsToPlace', { place: name })}
            className="h-11 min-w-[44px] flex-shrink-0 flex-row items-center justify-center rounded-xl border border-ink/[0.09] bg-surface-inset/90 active:bg-ink/[0.06] active:opacity-95"
          >
            <Ionicons name="navigate-outline" size={17} color={colors.inkMuted} />
          </Pressable>
        ) : null}
      </Pressable>

      {isToilet && showVenuePhone && primaryPhone ? (
        <View className="border-t border-ink/[0.06] px-3.5 pb-3 pt-2">
          <Pressable
            onPress={() => {
              const href = telHref(primaryPhone);
              if (href) void Linking.openURL(href);
            }}
            accessibilityRole="button"
            accessibilityLabel={primaryPhone}
            className="min-h-[48px] w-full items-center justify-center rounded-xl border border-ink/12 bg-surface-inset/80 active:bg-ink/[0.05]"
          >
            <Text style={{ fontFamily: f.medium }} className="text-[15px] text-ink">
              {t('hub.hygiene.callPlaceLine', { phone: primaryPhone })}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
