import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryHubBody } from '@/components/CategoryHubBody';
import { EmergencyButton } from '@/components/EmergencyButton';
import { HomeSuperAppHero } from '@/components/HomeSuperAppHero';
import { ReceptionHallHintBanner } from '@/components/ReceptionHallHintBanner';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useReceptionHallHint } from '@/hooks/useReceptionHallHint';
import { useLanguageStore } from '@/stores/languageStore';
import { getHomeContext } from '@/utils/homeContext';
import { localeForLang } from '@/utils/localeForLang';

/** Extra scroll padding for floating emergency FAB (no tab bar). */
const SCROLL_PAD_FAB = 80;

export default function HomeScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const ctx = useMemo(() => getHomeContext(now), [now]);

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

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  const { hint: receptionHint, dismiss: dismissReceptionHint } = useReceptionHallHint();

  return (
    <View className="flex-1 bg-surface-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + SCROLL_PAD_FAB }}
        keyboardShouldPersistTaps="never"
        showsVerticalScrollIndicator={false}
      >
        <HomeSuperAppHero
          lang={lang}
          greetingLine={heroGreeting}
          timeLine={heroTime}
          timeAccessibilityLabel={heroTimeA11y}
          tagline={t('home.heroTagline')}
          illustrationResizeMode="cover"
          onCategoriesPress={() => router.push('/categories')}
          categoriesA11yLabel={t('tabs.categories')}
          categoriesA11yHint={t('home.heroBrowseA11y')}
          onSavedPress={() => router.push('/saved')}
          savedA11yLabel={t('saved.title')}
          savedA11yHint={t('home.heroSavedA11y')}
          onSettings={() => router.push('/settings')}
          settingsLabel={t('common.settings')}
        />

        {receptionHint ? (
          <ReceptionHallHintBanner lang={lang} hint={receptionHint} onDismiss={dismissReceptionHint} />
        ) : null}

        <CategoryHubBody categoryId={1} lang={lang} listCopyNs="home" />
      </ScrollView>
      <EmergencyButton />
    </View>
  );
}
