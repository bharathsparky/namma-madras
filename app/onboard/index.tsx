import i18n from '@/i18n';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/OnboardingShell';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
/**
 * Step 1: English-first welcome (copy via `en` fixed translator), then language choice.
 */
export default function OnboardWelcomeScreen() {
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const en = useFontFamily('en');
  const ta = useFontFamily('ta');
  const hi = useFontFamily('hi');
  const w = i18n.getFixedT('en');
  const taT = i18n.getFixedT('ta');
  const hiT = i18n.getFixedT('hi');

  const goPersona = () => router.push('/onboard/persona');

  return (
    <OnboardingShell step={1} hero>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text
          style={{ fontFamily: ta.bold }}
          className="text-center text-[26px] leading-[32px] tracking-tight text-ink"
          accessibilityRole="header"
        >
          {w('onboarding.brandHeader')}
        </Text>
        <Text style={{ fontFamily: en.medium }} className="mt-1 text-center text-[15px] text-ink-muted">
          {w('onboarding.brandSubEn')}
        </Text>

        <View
          className="mt-8 rounded-2xl border border-ink/10 bg-surface-card-dark px-5 py-6"
          style={{
            shadowColor: '#0a0f0c',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.06,
            shadowRadius: 20,
          }}
        >
          <Text style={{ fontFamily: en.bold }} className="text-[11px] uppercase tracking-[0.14em] text-primary">
            {w('onboarding.welcomeKicker')}
          </Text>
          <Text style={{ fontFamily: en.bold }} className="mt-3 text-[22px] leading-[30px] text-ink">
            {w('onboarding.welcomeTitle')}
          </Text>
          <Text style={{ fontFamily: en.regular }} className="mt-3 text-[16px] leading-[25px] text-ink/88">
            {w('onboarding.welcomeBody')}
          </Text>
        </View>

        <Text style={{ fontFamily: en.medium }} className="mt-8 text-center text-[16px] text-ink">
          {w('onboarding.chooseLang')}
        </Text>
        <Text style={{ fontFamily: en.regular }} className="mt-1 text-center text-[14px] leading-[21px] text-ink-muted">
          {w('onboarding.chooseLangHint')}
        </Text>

        <View className="mt-5 gap-3">
          <Pressable
            onPress={() => void setLanguage('en').then(goPersona)}
            className="min-h-[54px] items-center justify-center rounded-2xl bg-primary active:opacity-92"
            accessibilityRole="button"
            accessibilityLabel={w('onboarding.startEn')}
          >
            <Text style={{ fontFamily: en.bold }} className="text-[17px] text-on-primary">
              {w('onboarding.startEn')}
            </Text>
            <Text style={{ fontFamily: en.regular }} className="mt-0.5 text-[13px] text-on-primary/90">
              English
            </Text>
          </Pressable>

          <Pressable
            onPress={() => void setLanguage('ta').then(goPersona)}
            className="min-h-[54px] flex-row items-center justify-center gap-2 rounded-2xl border border-ink/14 bg-surface-card-dark px-4 active:bg-ink/5"
            accessibilityRole="button"
            accessibilityLabel={taT('onboarding.startTa')}
          >
            <Text style={{ fontFamily: ta.bold }} className="text-[17px] text-ink">
              {taT('onboarding.startTa')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => void setLanguage('hi').then(goPersona)}
            className="min-h-[54px] flex-row items-center justify-center gap-2 rounded-2xl border border-ink/14 bg-surface-card-dark px-4 active:bg-ink/5"
            accessibilityRole="button"
            accessibilityLabel={hiT('onboarding.startHi')}
          >
            <Text style={{ fontFamily: hi.medium }} className="text-[17px] text-ink">
              {hiT('onboarding.startHi')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}
