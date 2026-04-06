import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CostBadge } from '@/components/CostBadge';
import { FrequencyBadge } from '@/components/FrequencyBadge';
import { MedicalMentalHealthBanner } from '@/components/MedicalMentalHealthBanner';
import { OfflineMapGuard } from '@/components/OfflineMapGuard';
import { PlaceDetailHero } from '@/components/PlaceDetailHero';
import { PlaceDetailSection } from '@/components/PlaceDetailSection';
import { StatusChip } from '@/components/StatusChip';
import { WorkRightsBanner } from '@/components/WorkRightsBanner';
import { CATEGORY_ID_ACCENT, CATEGORY_ID_SLUG } from '@/constants/categoryVisuals';
import { elevationSoft } from '@/constants/elevation';
import { PLACE_DETAIL } from '@/constants/placeDetailSpacing';
import { getPlaceCoverSource } from '@/constants/placeCoverAssets';
import { STAY_AMBER_TICKET } from '@/constants/stayHub';
import { colors, ui } from '@/constants/theme';
import {
  getApprovedTipForPlace,
  getPlaceById,
  insertUserTip,
  isPlaceSaved,
  toggleSavedPlace,
} from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
import { pickTaEn } from '@/utils/pickTaEn';
import { placeDisplayName } from '@/utils/seedLocale';
import { getPlaceStatusChip } from '@/utils/placeStatus';
import { getPrimaryTimingText } from '@/utils/placeTimingDisplay';

export default function PlaceDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const idStr = rawId == null ? '' : Array.isArray(rawId) ? (rawId[0] ?? '') : rawId;
  const db = useSQLiteContext();
  const placeId = Number(idStr);
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const shotRef = useRef<ViewShot | null>(null);
  const [tip, setTip] = useState('');
  const [, bump] = useState(0);

  const place = useMemo(() => (Number.isFinite(placeId) ? getPlaceById(db, placeId) : null), [db, placeId]);
  const approvedTip = useMemo(
    () => (Number.isFinite(placeId) ? getApprovedTipForPlace(db, placeId) : null),
    [db, placeId],
  );
  const saved = useMemo(
    () => (Number.isFinite(placeId) ? isPlaceSaved(db, placeId) : false),
    [db, placeId, bump],
  );

  const fade = useRef(new Animated.Value(0)).current;

  const timingText = useMemo(() => {
    if (!place) return '';
    return getPrimaryTimingText(place, lang, t).trim();
  }, [place, lang, t]);

  useEffect(() => {
    if (!place) {
      fade.setValue(1);
      return;
    }
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        fade.setValue(1);
        return;
      }
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [place, fade]);

  if (!place) {
    return (
      <View className="flex-1 bg-surface-dark px-6">
        <View
          className="flex-row items-center justify-end px-2"
          style={{ paddingTop: Math.max(insets.top, 10), paddingBottom: 10 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="min-h-[48px] min-w-[48px] items-center justify-center rounded-xl active:bg-ink/8"
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Ionicons name="chevron-back" size={26} color={colors.ink} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-2 pb-16">
          <View
            className="items-center justify-center rounded-full border border-ink/10 bg-surface-card-dark"
            style={{ width: 88, height: 88 }}
            accessibilityElementsHidden
          >
            <Ionicons name="map-outline" size={36} color={colors.inkFaint} />
          </View>
          <Text style={{ fontFamily: f.bold }} className="mt-6 text-center text-[20px] leading-[26px] text-ink">
            {t('place.notFound')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-2 max-w-[320px] text-center text-[15px] leading-[23px] text-ink-muted">
            {t('place.notFoundHint')}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-8 min-h-[50px] justify-center rounded-2xl bg-primary px-8 active:opacity-92"
            accessibilityRole="button"
          >
            <Text style={{ fontFamily: f.bold }} className="text-[16px] text-on-primary">
              {t('common.back')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const name = placeDisplayName(place, lang, t);
  const desc = pickTaEn(lang, place.description_ta ?? '', place.description_en ?? '');
  const coverSource = getPlaceCoverSource(place);
  const chip = getPlaceStatusChip(place, lang, t);
  const tel = place.contact_phone?.replace(/\D/g, '');
  const accent = CATEGORY_ID_ACCENT[place.category_id] ?? colors.primary;
  const categorySlug = CATEGORY_ID_SLUG[place.category_id] ?? 'food';

  const openMaps = () => {
    if (place.latitude != null && place.longitude != null) {
      void Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
      );
    } else {
      void Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.full_address)}`,
      );
    }
  };

  const sharePng = async () => {
    try {
      const uri = await shotRef.current?.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: t('common.share'),
        });
      }
    } catch {
      Alert.alert('', t('place.shareFailed'));
    }
  };

  const submitTip = () => {
    if (!tip.trim()) return;
    insertUserTip(db, place.id, tip.trim());
    setTip('');
    Alert.alert('', t('common.tipThanks'));
  };

  const toggleSave = () => {
    toggleSavedPlace(db, place.id, !saved);
    bump((x) => x + 1);
  };

  const REPORT_EMAIL = 'chennai.survival.guide.feedback@proton.me';

  const stayHasCallouts =
    place.category_id === 2 &&
    (place.requires_valid_ticket === 1 ||
      place.hospital_guest_only === 1 ||
      place.includes_food === 1 ||
      Boolean(place.ngo_name?.trim()));

  return (
    <View className="flex-1 bg-surface-dark">
      <View
        className="flex-row items-center justify-between bg-surface-dark px-2"
        style={{ paddingTop: Math.max(insets.top, 10), paddingBottom: 10 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="min-h-[48px] min-w-[48px] items-center justify-center rounded-xl active:bg-ink/8"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Pressable
          onPress={toggleSave}
          className="min-h-[48px] min-w-[48px] items-center justify-center rounded-xl active:bg-ink/8"
          accessibilityRole="button"
          accessibilityLabel={saved ? t('common.saved') : t('common.save')}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={24}
            color={saved ? colors.primary : colors.inkMuted}
          />
        </Pressable>
      </View>

      <Animated.View className="flex-1" style={{ opacity: fade }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: PLACE_DETAIL.scrollPaddingX,
            paddingBottom: insets.bottom + 32,
          }}
          showsVerticalScrollIndicator={false}
        >
        <View style={{ marginTop: PLACE_DETAIL.heroTop }}>
          <PlaceDetailHero
            lang={lang}
            name={name}
            area={place.area}
            accent={accent}
            categorySlug={categorySlug}
          />
        </View>

        {coverSource ? (
          <View
            className="w-full overflow-hidden rounded-2xl border border-ink/10 bg-surface-inset"
            style={{ aspectRatio: 16 / 9, marginTop: PLACE_DETAIL.afterHero }}
          >
            <Image
              source={coverSource}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`place-hero-${place.id}`}
              accessibilityRole="image"
              accessibilityLabel={name}
            />
          </View>
        ) : null}

        {place.category_id !== 2 ? (
          <View
            className="flex-row flex-wrap gap-2"
            style={{
              marginTop: coverSource ? PLACE_DETAIL.afterCover : PLACE_DETAIL.afterHero,
            }}
          >
            <StatusChip lang={lang} status={chip.kind} label={chip.label} />
            <CostBadge
              lang={lang}
              costType={place.cost_type}
              noteText={pickTaEn(lang, place.cost_note_ta ?? '', place.cost_note_en ?? '')}
            />
            <FrequencyBadge lang={lang} frequency={place.frequency} />
          </View>
        ) : null}

        {timingText ? (
          <PlaceDetailSection lang={lang} label={t('place.timing')}>
            <Text style={{ fontFamily: f.regular }} className="text-[16px] leading-[25px] text-ink/88">
              {timingText}
            </Text>
          </PlaceDetailSection>
        ) : null}

        {stayHasCallouts ? (
          <PlaceDetailSection lang={lang} label={t('place.sectionGoodToKnow')}>
            <View className="gap-3">
              {place.requires_valid_ticket === 1 ? (
                <View
                  className="flex-row items-start gap-2.5 rounded-2xl px-3.5 py-3"
                  style={{
                    borderWidth: 1,
                    borderColor: STAY_AMBER_TICKET.borderColor,
                    backgroundColor: STAY_AMBER_TICKET.backgroundPanel,
                  }}
                >
                  <Ionicons
                    name="ticket-outline"
                    size={18}
                    color={STAY_AMBER_TICKET.icon}
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    style={{ fontFamily: f.medium, color: STAY_AMBER_TICKET.textDetail }}
                    className="flex-1 text-[14px] leading-[21px]"
                  >
                    {t('hub.stay.detailTicket')}
                  </Text>
                </View>
              ) : null}
              {place.hospital_guest_only === 1 ? (
                <View className="flex-row items-start gap-2.5 rounded-2xl border border-ink/12 bg-surface-inset px-3.5 py-3">
                  <Ionicons name="medical-outline" size={18} color={colors.inkMuted} style={{ marginTop: 2 }} />
                  <Text style={{ fontFamily: f.medium }} className="flex-1 text-[14px] leading-[21px] text-ink-muted">
                    {t('hub.stay.detailHospital')}
                  </Text>
                </View>
              ) : null}
              {place.includes_food === 1 ? (
                <View className="flex-row items-center gap-2 rounded-2xl border border-badge-open/28 bg-badge-open/10 px-3.5 py-2.5">
                  <Ionicons name="nutrition-outline" size={18} color={colors.badgeOpen} />
                  <Text style={{ fontFamily: f.bold }} className="text-[14px] text-badge-open">
                    {t('hub.stay.detailFood')}
                  </Text>
                </View>
              ) : null}
              {place.ngo_name?.trim() ? (
                <Text style={{ fontFamily: f.regular }} className="text-[13px] leading-5 text-ink-faint">
                  {t('hub.stay.placeNgo', { name: place.ngo_name.trim() })}
                </Text>
              ) : null}
            </View>
          </PlaceDetailSection>
        ) : null}

        {place.category_id === 3 ? (
          <PlaceDetailSection lang={lang} label={t('place.sectionSupport')}>
            <MedicalMentalHealthBanner lang={lang} />
          </PlaceDetailSection>
        ) : null}

        {place.category_id === 5 ? (
          <PlaceDetailSection lang={lang} label={t('place.sectionSupport')}>
            <WorkRightsBanner lang={lang} />
          </PlaceDetailSection>
        ) : null}

        <PlaceDetailSection lang={lang} label={t('place.sectionLocation')}>
          {place.latitude != null && place.longitude != null ? (
            <OfflineMapGuard
              latitude={place.latitude}
              longitude={place.longitude}
              address={place.full_address}
              lang={lang}
            />
          ) : (
            <Text style={{ fontFamily: f.regular }} className="text-[15px] leading-[23px] text-ink/80">
              {place.full_address}
            </Text>
          )}
        </PlaceDetailSection>

        {desc ? (
          <PlaceDetailSection lang={lang} label={t('place.sectionAbout')}>
            <Text style={{ fontFamily: f.regular }} className="text-[16px] leading-[25px] text-ink/85">
              {desc}
            </Text>
          </PlaceDetailSection>
        ) : null}

        <View
          className="overflow-hidden rounded-2xl border border-ink/10 bg-surface-card-dark"
          style={{ marginTop: PLACE_DETAIL.section }}
        >
          <View style={{ height: 3, backgroundColor: accent }} />
          <View className="px-4 py-3.5" style={{ backgroundColor: ui.accentFillInvalid }}>
            <Text style={{ fontFamily: f.regular, color: ui.captionWarm }} className="text-[13px] leading-[20px]">
              {t('common.ngoTimingNote')}
            </Text>
            {place.category_id === 2 ? (
              <Text style={{ fontFamily: f.medium, color: ui.captionWarm }} className="mt-2 text-[13px] leading-5">
                {t('place.contactConfirm')}
              </Text>
            ) : null}
          </View>
        </View>

        {approvedTip ? (
          <View
            className="rounded-2xl border border-primary/18 bg-primary/[0.07] px-4 py-3.5"
            style={{ marginTop: PLACE_DETAIL.section }}
          >
            <Text style={{ fontFamily: f.bold }} className="text-[11px] uppercase tracking-[0.12em] text-primary">
              {t('place.tipLabel')}
            </Text>
            <Text style={{ fontFamily: f.regular }} className="mt-2 text-[15px] leading-[23px] text-ink/88">
              {approvedTip}
            </Text>
          </View>
        ) : null}

        <PlaceDetailSection lang={lang} label={t('place.sectionActions')}>
          {tel ? (
            <Pressable
              onPress={() => void Linking.openURL(`tel:${tel}`)}
              className="min-h-[52px] w-full flex-row items-center justify-center rounded-2xl bg-primary active:opacity-92"
              accessibilityRole="button"
              accessibilityLabel={t('common.call')}
            >
              <Ionicons name="call" size={22} color={colors.onPrimary} />
              <Text style={{ fontFamily: f.bold }} className="ml-2 text-[17px] text-on-primary">
                {t('common.call')}
              </Text>
            </Pressable>
          ) : null}

          <View className={`flex-row gap-3 ${tel ? 'mt-4' : ''}`}>
            <Pressable
              onPress={() => void openMaps()}
              className="min-h-[50px] flex-1 flex-row items-center justify-center rounded-2xl border border-ink/12 bg-surface-card-dark active:bg-ink/6"
              style={elevationSoft}
              accessibilityRole="button"
              accessibilityLabel={t('common.directions')}
            >
              <Ionicons name="navigate-outline" size={20} color={colors.ink} />
              <Text style={{ fontFamily: f.medium }} className="ml-2 text-[15px] text-ink/90">
                {t('common.directions')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void sharePng()}
              className="min-h-[50px] flex-1 flex-row items-center justify-center rounded-2xl border border-ink/12 bg-surface-card-dark active:bg-ink/6"
              style={elevationSoft}
              accessibilityRole="button"
              accessibilityLabel={t('common.share')}
            >
              <Ionicons name="share-outline" size={20} color={colors.ink} />
              <Text style={{ fontFamily: f.medium }} className="ml-2 text-[15px] text-ink/90">
                {t('common.share')}
              </Text>
            </Pressable>
          </View>
        </PlaceDetailSection>

        <PlaceDetailSection lang={lang} label={t('place.sectionCommunity')}>
          <View className="rounded-2xl border border-ink/10 bg-surface-card-dark p-3.5" style={elevationSoft}>
            <TextInput
              value={tip}
              onChangeText={setTip}
              placeholder={t('common.tipPlaceholder')}
              placeholderTextColor={ui.placeholderMuted}
              multiline
              maxLength={280}
              className="min-h-[88px] rounded-xl border border-ink/10 bg-surface-inset p-3 text-[15px] text-ink/90"
              style={{ fontFamily: f.regular }}
              textAlignVertical="top"
            />
            <Pressable
              onPress={submitTip}
              className="mt-3 min-h-[48px] items-center justify-center rounded-xl bg-primary-dim active:opacity-92"
              accessibilityRole="button"
            >
              <Text style={{ fontFamily: f.bold }} className="text-on-primary">
                {t('common.tipSubmit')}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() =>
              void Linking.openURL(
                `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Report place #${place.id}`)}&body=${encodeURIComponent(place.full_address)}`,
              )
            }
            className="mt-4 min-h-[48px] justify-center"
            accessibilityRole="button"
          >
            <Text style={{ fontFamily: f.medium }} className="text-center text-[15px] text-primary">
              {t('common.report')}
            </Text>
          </Pressable>
        </PlaceDetailSection>

        {place.is_verified && place.verified_by_org ? (
          <Text
            style={{ fontFamily: f.regular, marginTop: PLACE_DETAIL.section }}
            className="text-center text-[13px] text-ink-faint"
          >
            {t('place.verifiedBy', {
              org: place.verified_by_org,
              date: place.verified_date ?? '—',
            })}
          </Text>
        ) : null}
        </ScrollView>
      </Animated.View>

      <View className="absolute" style={{ left: -2000, top: 0 }} collapsable={false}>
        <ViewShot
          ref={shotRef}
          options={{ format: 'png', quality: 0.95 }}
          style={{
            width: 320,
            padding: 24,
            backgroundColor: colors.surfaceCardDark,
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(22, 26, 25, 0.08)',
          }}
        >
          <Text style={{ fontFamily: f.bold, color: colors.ink, fontSize: 18, letterSpacing: -0.3 }}>{name}</Text>
          <Text style={{ fontFamily: f.regular, color: 'rgba(22, 26, 25, 0.62)', marginTop: 10, fontSize: 14, lineHeight: 20 }}>
            {place.full_address}
          </Text>
          <View style={{ marginTop: 16, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0, 170, 19, 0.12)' }} />
          <Text style={{ fontFamily: f.medium, color: colors.primary, marginTop: 12, fontSize: 13 }}>{t('appName')}</Text>
        </ViewShot>
      </View>
    </View>
  );
}
