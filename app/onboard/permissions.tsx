import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OnboardingShell } from '@/components/OnboardingShell';
import { warmShadowKey } from '@/constants/asphalt';
import { colors, onboarding } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
import { useLocationStore } from '@/stores/locationStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { requestNotificationPermissionsIfSupported } from '@/utils/requestNotificationPermissions';

/** Fallback coords (Chennai centre) when GPS is slow or unavailable. */
const FALLBACK_LAT = 13.0827;
const FALLBACK_LON = 80.2707;

/** iOS/Android need the first system dialog to dismiss before showing the next, or the UI can freeze or skip prompts. */
async function yieldBetweenSystemPermissionDialogs(): Promise<void> {
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
  await new Promise<void>((r) =>
    setTimeout(r, Platform.OS === 'ios' ? 450 : Platform.OS === 'android' ? 350 : 300),
  );
}

function PermHeroIllustration() {
  return (
    <View style={styles.heroWrap} accessibilityElementsHidden importantForAccessibility="no">
      <View style={styles.heroCircle}>
        <Ionicons name="map-outline" size={78} color={colors.ink} style={styles.heroMap} />
        <View style={styles.heroPinWrap}>
          <Ionicons name="location" size={52} color={onboarding.teal} />
        </View>
      </View>
    </View>
  );
}

export default function OnboardPermissionsScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const setComplete = useOnboardingStore((s) => s.setComplete);
  const setLoc = useLocationStore((s) => s.setLocation);
  const setPerm = useLocationStore((s) => s.setPermissionStatus);
  const [busy, setBusy] = useState(false);

  /** Completing onboarding without granting permissions — avoid leaving location stuck at `unknown`. */
  const finish = async () => {
    const status = useLocationStore.getState().permissionStatus;
    if (status === 'unknown') {
      setPerm('denied');
    }
    await setComplete(true);
    router.replace('/home');
  };

  /**
   * Prefer last-known position (fast), then a bounded GPS fix. `getCurrentPositionAsync` alone can
   * hang for a long time indoors and block the next permission dialog + navigation.
   */
  const resolveCoordinatesAfterGrant = async () => {
    const apply = (lat: number, lon: number) => setLoc(lat, lon);

    try {
      const last = await Location.getLastKnownPositionAsync({
        maxAge: 1000 * 60 * 30,
        requiredAccuracy: 5000,
      });
      if (last) {
        apply(last.coords.latitude, last.coords.longitude);
        return;
      }
    } catch {
      /* fall through */
    }

    const timeoutMs = 12_000;
    try {
      const pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
        new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error('location-timeout')), timeoutMs),
        ),
      ]);
      apply(pos.coords.latitude, pos.coords.longitude);
    } catch {
      apply(FALLBACK_LAT, FALLBACK_LON);
    }
  };

  const allowLocation = async () => {
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.status === 'granted') {
        setPerm('granted');
        await resolveCoordinatesAfterGrant();
      } else {
        setPerm('denied');
      }
    } catch {
      setPerm('denied');
    }
  };

  const allowNotif = async () => {
    await requestNotificationPermissionsIfSupported();
  };

  const onContinue = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await allowLocation();
      await yieldBetweenSystemPermissionDialogs();
      await allowNotif();
    } catch {
      /* Location + notifications are best-effort; still complete onboarding. */
    }
    try {
      await finish();
    } finally {
      setBusy(false);
    }
  };

  const onNotNow = () => {
    if (busy) return;
    void finish();
  };

  const locDesc = lang === 'ta' ? t('onboarding.locBodyTa') : t('onboarding.permLocationDesc');

  return (
    <OnboardingShell
      step={3}
      hero={false}
      onBack={busy ? undefined : () => router.back()}
      footer={
        <View style={[styles.footerCol, styles.footerAlign]}>
          <View style={[styles.primaryBtnChrome, busy && styles.primaryBtnChromeDisabled]} collapsable={false}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => void onContinue()}
              disabled={busy}
              accessibilityRole="button"
              accessibilityState={{ busy }}
              accessibilityLabel={busy ? t('onboarding.permWorking') : t('onboarding.langContinue')}
              style={styles.primaryBtnHit}
            >
              {busy ? (
                <View style={styles.primaryBtnRow}>
                  <ActivityIndicator color={onboarding.onTeal} />
                  <Text style={[styles.primaryBtnText, { fontFamily: f.bold }]}>{t('onboarding.permWorking')}</Text>
                </View>
              ) : (
                <Text style={[styles.primaryBtnText, { fontFamily: f.bold }]}>{t('onboarding.langContinue')}</Text>
              )}
            </TouchableOpacity>
          </View>
          <Pressable
            onPress={onNotNow}
            disabled={busy}
            hitSlop={12}
            className="min-h-[44px] items-center justify-center py-1 active:opacity-70 disabled:opacity-40"
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.permLater')}
          >
            <Text style={{ fontFamily: f.medium }} className="text-[16px] text-ink-muted">
              {t('onboarding.permLater')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <ScrollView
        className="flex-1 -mx-5 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <PermHeroIllustration />

        <Text
          style={{ fontFamily: f.bold }}
          className="text-center text-[24px] leading-[30px] tracking-tight text-ink"
          accessibilityRole="header"
        >
          {t('onboarding.permLastStepTitle')}
        </Text>
        <Text
          style={{ fontFamily: f.regular }}
          className="mt-2 px-1 text-center text-[14px] leading-[21px] text-ink-muted"
        >
          {t('onboarding.permIntro')}
        </Text>

        <View className="mt-6 gap-3">
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={22} color={onboarding.teal} />
            </View>
            <View className="min-w-0 flex-1">
              <Text style={{ fontFamily: f.bold }} className="text-[16px] leading-[21px] text-ink">
                {t('onboarding.permLocationTitle')}
              </Text>
              <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-[19px] text-ink-muted">
                {locDesc}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications-outline" size={22} color={onboarding.teal} />
            </View>
            <View className="min-w-0 flex-1">
              <Text style={{ fontFamily: f.bold }} className="text-[16px] leading-[21px] text-ink">
                {t('onboarding.permNotifTitle')}
              </Text>
              <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-[19px] text-ink-muted">
                {t('onboarding.permNotifDesc')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 20,
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: 'rgba(31, 28, 26, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(31, 28, 26, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: warmShadowKey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  heroMap: {
    opacity: 0.22,
  },
  heroPinWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceCardDark,
    borderWidth: 1,
    borderColor: 'rgba(16, 16, 16, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#0a0f0c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: onboarding.iconWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCol: {
    gap: 12,
  },
  /** Match language / persona horizontal inset. */
  footerAlign: {
    marginHorizontal: -20,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
  },
  /** Same deep teal as language step — not brand marketing green. */
  primaryBtnChrome: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: onboarding.teal,
    overflow: 'hidden',
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: onboarding.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      default: {},
    }),
  },
  primaryBtnChromeDisabled: {
    opacity: 0.88,
  },
  primaryBtnHit: {
    minHeight: 54,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryBtnText: {
    color: onboarding.onTeal,
    fontSize: 16,
  },
});
