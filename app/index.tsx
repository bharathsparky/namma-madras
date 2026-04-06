import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function Index() {
  const langReady = useLanguageStore((s) => s.hydrated);
  const ob = useOnboardingStore((s) => s.hydrated);
  const complete = useOnboardingStore((s) => s.complete);

  if (!langReady || !ob) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surfaceDark,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!complete) {
    return <Redirect href="/onboard" />;
  }

  return <Redirect href="/home" />;
}
