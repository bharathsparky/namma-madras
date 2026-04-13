import { router, useFocusEffect, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmergencyContactsFlatList } from '@/components/EmergencyContactsFlatList';
import { HomeSuperAppHero } from '@/components/HomeSuperAppHero';
import { emergencyHubVisual } from '@/constants/categoryHubVisual';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLanguageStore } from '@/stores/languageStore';
import { getHomeContext } from '@/utils/homeContext';
import { localeForLang } from '@/utils/localeForLang';

export default function EmergencyScreen() {
  const { t } = useTranslation();
  const nav = useRouter();
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const ctx = useMemo(() => getHomeContext(now), [now]);

  const goBack = useCallback(() => {
    if (nav.canGoBack()) nav.back();
    else nav.replace('/home');
  }, [nav]);

  const heroGreeting = t(`home.heroGreeting.${ctx}`);
  const heroTime = useMemo(
    () =>
      now.toLocaleTimeString(localeForLang(lang), {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [now, lang],
  );
  const heroTimeA11y = t('home.heroTimeA11y', { time: heroTime });

  const hero = useMemo(
    () => (
      <HomeSuperAppHero
        lang={lang}
        greetingLine={heroGreeting}
        timeLine={heroTime}
        timeAccessibilityLabel={heroTimeA11y}
        tagline={t('hub.emergency.heroTagline')}
        theme={emergencyHubVisual.theme}
        illustrationSource={emergencyHubVisual.illustration}
        quickAction={{
          mode: 'categories',
          onPress: () => router.push('/categories'),
          accessibilityLabel: t('tabs.categories'),
          accessibilityHint: t('home.heroBrowseA11y'),
        }}
        onSavedPress={() => router.push('/saved')}
        savedA11yLabel={t('saved.title')}
        savedA11yHint={t('home.heroSavedA11y')}
        onSettings={() => router.push('/settings')}
        settingsLabel={t('common.settings')}
        onBackPress={goBack}
        backA11yLabel={t('common.back')}
      />
    ),
    [lang, heroGreeting, heroTime, heroTimeA11y, t, goBack],
  );

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  return (
    <View className="flex-1 bg-transparent">
      <EmergencyContactsFlatList lang={lang} topContent={hero} bottomInset={insets.bottom} />
    </View>
  );
}
