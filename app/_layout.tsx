import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  MuktaMalar_400Regular,
  MuktaMalar_500Medium,
  MuktaMalar_700Bold,
} from '@expo-google-fonts/mukta-malar';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { initDatabase } from '@/db/initDatabase';
import { useLanguageStore } from '@/stores/languageStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { usePersonaStore } from '@/stores/personaStore';
import { useSettingsStore } from '@/stores/settingsStore';

import { SurfaceGrainOverlay } from '@/components/SurfaceGrainOverlay';
import { colors } from '@/constants/theme';
import '../global.css';

LogBox.ignoreLogs(['ViewTagResolver']);

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

function LoadingScreen() {
  return (
    <View
      style={styles.loadingRoot}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <SurfaceGrainOverlay />
      <ActivityIndicator size="large" color={colors.inkMuted} />
      <Text
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Setting up… first launch can take a moment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    MuktaMalar_400Regular,
    MuktaMalar_500Medium,
    MuktaMalar_700Bold,
    /** English — Proxima Nova (`assets/fonts/ProximaNova-*.ttf`). */
    ProximaNova_400Regular: require('../assets/fonts/ProximaNova-Regular.ttf'),
    ProximaNova_600SemiBold: require('../assets/fonts/ProximaNova-Semibold.ttf'),
    ProximaNova_700Bold: require('../assets/fonts/ProximaNova-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return (
      <>
        <StatusBar style="dark" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLiteProvider
        databaseName="csg.db"
        assetSource={{ assetId: require('../assets/db/csg.db') }}
        onInit={initDatabase}
        useSuspense
      >
        <RootNav />
      </SQLiteProvider>
    </Suspense>
  );
}

function RootNav() {
  const hydrateLang = useLanguageStore((s) => s.hydrate);
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);
  const hydratePersona = usePersonaStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    void Promise.all([
      hydrateLang(),
      hydrateOnboarding(),
      hydratePersona(),
      hydrateSettings(),
    ]);
  }, [hydrateLang, hydrateOnboarding, hydratePersona, hydrateSettings]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceDark }}>
      <SurfaceGrainOverlay />
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'none',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboard" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="hub/[slug]" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="place/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="category/[slug]" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="settings" options={{ presentation: 'modal', animation: 'none' }} />
        <Stack.Screen name="data-sources" options={{ presentation: 'modal', animation: 'none' }} />
        <Stack.Screen name="search" />
      </Stack>
    </View>
  );
}
