import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/OnboardingShell';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
import { useLocationStore } from '@/stores/locationStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { colors } from '@/constants/theme';
import { requestNotificationPermissionsIfSupported } from '@/utils/requestNotificationPermissions';

export default function OnboardPermissionsScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const setComplete = useOnboardingStore((s) => s.setComplete);
  const setLoc = useLocationStore((s) => s.setLocation);
  const setPerm = useLocationStore((s) => s.setPermissionStatus);

  const finish = async () => {
    await setComplete(true);
    router.replace('/home');
  };

  const allowLocation = async () => {
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.status === 'granted') {
        setPerm('granted');
        try {
          const pos = await Location.getCurrentPositionAsync({});
          setLoc(pos.coords.latitude, pos.coords.longitude);
        } catch {
          setLoc(13.0827, 80.2707);
        }
      } else {
        setPerm('denied');
      }
    } catch {
      setPerm('denied');
    }
  };

  const skipLocation = () => {
    setPerm('denied');
  };

  const allowNotif = async () => {
    await requestNotificationPermissionsIfSupported();
  };

  const skipNotif = () => {
    /* Declining optional notifications — no app state to update. */
  };

  return (
    <OnboardingShell
      step={3}
      onBack={() => router.back()}
      footer={
        <Pressable
          onPress={() => void finish()}
          className="mt-4 min-h-[54px] items-center justify-center rounded-2xl bg-primary active:opacity-92"
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.permEnterApp')}
        >
          <Text style={{ fontFamily: f.bold }} className="text-[17px] text-on-primary">
            {t('onboarding.permEnterApp')}
          </Text>
        </Pressable>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <Text style={{ fontFamily: f.bold }} className="text-center text-[24px] leading-[30px] text-ink">
          {t('onboarding.permHeadline')}
        </Text>
        <Text style={{ fontFamily: f.regular }} className="mt-2 text-center text-[15px] leading-[23px] text-ink-muted">
          {t('onboarding.permIntro')}
        </Text>

        <View
          className="mt-8 rounded-2xl border border-ink/10 bg-surface-card-dark p-5"
          style={{
            shadowColor: '#0a0f0c',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
          }}
        >
          <View className="flex-row items-center gap-3">
            <View className="rounded-xl bg-primary/12 p-2.5">
              <Ionicons name="location-outline" size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: f.bold }} className="text-[17px] text-ink">
                {t('onboarding.permLocationTitle')}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: f.regular }} className="mt-3 text-[15px] leading-[23px] text-ink-muted">
            {lang === 'ta' ? t('onboarding.locBodyTa') : t('onboarding.permLocationDesc')}
          </Text>
          <View className="mt-5 flex-row flex-wrap items-center gap-3">
            <Pressable
              onPress={() => void allowLocation()}
              className="min-h-[50px] min-w-[140px] flex-1 items-center justify-center rounded-xl bg-primary px-4 active:opacity-92"
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.locAllow')}
            >
              <Text style={{ fontFamily: f.bold }} className="text-[16px] text-on-primary">
                {t('onboarding.locAllow')}
              </Text>
            </Pressable>
            <Pressable
              onPress={skipLocation}
              className="min-h-[48px] justify-center px-2 py-2"
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.permLater')}
            >
              <Text style={{ fontFamily: f.medium }} className="text-[15px] text-primary">
                {t('onboarding.permLater')}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-5 rounded-2xl border border-ink/10 bg-surface-card-dark p-5">
          <View className="flex-row items-center gap-3">
            <View className="rounded-xl bg-ink/6 p-2.5">
              <Ionicons name="notifications-outline" size={24} color={colors.ink} />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: f.bold }} className="text-[17px] text-ink">
                {t('onboarding.permNotifTitle')}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: f.regular }} className="mt-3 text-[15px] leading-[23px] text-ink-muted">
            {t('onboarding.permNotifDesc')}
          </Text>
          <View className="mt-5 flex-row flex-wrap items-center gap-3">
            <Pressable
              onPress={() => void allowNotif()}
              className="min-h-[50px] min-w-[140px] flex-1 items-center justify-center rounded-xl border border-ink/14 bg-surface-dark px-4 active:bg-ink/5"
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.notifAllow')}
            >
              <Text style={{ fontFamily: f.bold }} className="text-[16px] text-ink">
                {t('onboarding.notifAllow')}
              </Text>
            </Pressable>
            <Pressable
              onPress={skipNotif}
              className="min-h-[48px] justify-center px-2 py-2"
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.permLater')}
            >
              <Text style={{ fontFamily: f.medium }} className="text-[15px] text-primary">
                {t('onboarding.permLater')}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={{ fontFamily: f.regular }} className="mt-6 text-center text-[13px] leading-[19px] text-ink-faint">
          {t('onboarding.permFooterHint')}
        </Text>
      </ScrollView>
    </OnboardingShell>
  );
}
