import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { HYGIENE_NOTES } from '@/data/seeds/hygiene';
import { listingCardOutline, listingCardShell } from '@/constants/listingCardChrome';
import { colors, ui } from '@/constants/theme';
import type { Lang, PlaceRow } from '@/db/types';
import { distanceKmIfPresent } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn, pickTaEnHi } from '@/utils/pickTaEn';
import { placeDisplayName, placeDisplayTiming } from '@/utils/seedLocale';

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
  /** Venue-specific line — GCC helpline 1913 is once in the Toilets section header, not on every card. */
  const showVenuePhone =
    isToilet && primaryPhone && primaryPhone.replace(/\D/g, '') !== '1913';

  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl bg-surface-card-dark"
      style={listingCardShell(listingCardOutline.hygiene)}
    >
      <Pressable onPress={() => openPlace(place.id)} accessibilityRole="button" accessibilityLabel={name}>
        <View className="p-4">
          <View className="flex-row flex-wrap gap-2">
            {costFree ? (
              <View className="rounded-full bg-badgeOpen/18 px-2.5 py-0.5">
                <Text style={{ fontFamily: f.bold, color: colors.badgeOpen }} className="text-[11px] uppercase tracking-wide">
                  {t('hub.hygiene.badgeFree')}
                </Text>
              </View>
            ) : null}
            {costNominal ? (
              <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: ui.badgeSubsidisedWash }}>
                <Text style={{ fontFamily: f.bold, color: colors.badgeSubsidised }} className="text-[11px] uppercase tracking-wide">
                  {t('hub.hygiene.badgeNominal')}
                </Text>
              </View>
            ) : null}
            {!costFree && !costNominal ? (
              <View className="rounded-full bg-ink/10 px-2.5 py-0.5">
                <Text style={{ fontFamily: f.bold }} className="text-[11px] uppercase tracking-wide text-ink-muted">
                  {t('hub.hygiene.badgePaid')}
                </Text>
              </View>
            ) : null}
            {womenOnly ? (
              <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: ui.badgeWomenOnlyWash }}>
                <Text style={{ fontFamily: f.bold }} className="text-[11px] uppercase tracking-wide text-pink-700">
                  {t('hub.hygiene.badgeWomenOnly')}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={{ fontFamily: f.bold }}
            className="mt-2 text-[18px] leading-6 tracking-[-0.25px] text-ink"
            numberOfLines={4}
          >
            {name}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1 text-sm text-ink-muted" numberOfLines={2}>
            {place.area}
            {timing ? ` · ${timing}` : ''}
          </Text>
          {dist != null ? (
            <Text style={{ fontFamily: f.medium }} className="mt-1 text-xs text-ink-faint">
              {t('common.distanceKmAway', { km: dist.toFixed(1) })}
            </Text>
          ) : null}

          {isBarber ? (
            <View className="mt-3 rounded-xl border border-primary/15 bg-primary/[0.05] px-3 py-2.5">
              <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-wide text-primary">
                {t('hub.hygiene.barberWalkinTitle')}
              </Text>
              <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-[20px] text-ink">
                {walkInBody}
              </Text>
            </View>
          ) : null}
        </View>
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

      <Pressable
        onPress={() => openPlace(place.id)}
        accessibilityRole="button"
        accessibilityHint={t('a11y.openPlace')}
        className="flex-row items-center justify-end border-t border-ink/[0.06] px-3 py-2.5 active:bg-ink/[0.03]"
      >
        <Text style={{ fontFamily: f.medium }} className="text-xs text-primary">
          {t('hub.hygiene.openDetails')}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}
