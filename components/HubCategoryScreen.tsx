import { Redirect, router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryHubBody } from '@/components/CategoryHubBody';
import { CategoryPlacesHubBody } from '@/components/CategoryPlacesHubBody';
import { LearnHubBody } from '@/components/LearnHubBody';
import { StayHubBody } from '@/components/StayHubBody';
import { WorkHubBody } from '@/components/WorkHubBody';
import { HygieneHubBody } from '@/components/HygieneHubBody';
import { EmergencyButton } from '@/components/EmergencyButton';
import { HomeSuperAppHero } from '@/components/HomeSuperAppHero';
import { getCategoryHubVisual } from '@/constants/categoryHubVisual';
import { getCategoryBySlug } from '@/db/queries';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLanguageStore } from '@/stores/languageStore';
import { getHomeContext } from '@/utils/homeContext';
import { localeForLang } from '@/utils/localeForLang';

const SCROLL_PAD_FAB = 80;

type Props = { slug: string };

/**
 * Shared hub shell (hero + body) for `/hub/[slug]` and the static `/hub/learn` route.
 */
export function HubCategoryScreen({ slug }: Props) {
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const ctx = useMemo(() => getHomeContext(now), [now]);

  const category = useMemo(() => (slug ? getCategoryBySlug(db, slug) : null), [db, slug]);
  const visual = useMemo(() => getCategoryHubVisual(slug), [slug]);

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

  if (!slug) {
    return <Redirect href="/categories" />;
  }
  if (slug === 'food') {
    return <Redirect href="/home" />;
  }
  if (!category) {
    return <Redirect href="/categories" />;
  }
  if (!visual) {
    return <Redirect href={`/category/${slug}`} />;
  }

  const tagline = t(`hub.${slug}.heroTagline`);

  if (slug === 'hygiene') {
    return (
      <View className="flex-1 bg-surface-dark">
        <HygieneHubBody
          categoryId={category.id}
          lang={lang}
          listCopyNs={`hub.${slug}`}
          hero={
            <HomeSuperAppHero
              lang={lang}
              greetingLine={heroGreeting}
              timeLine={heroTime}
              timeAccessibilityLabel={heroTimeA11y}
              tagline={tagline}
              theme={visual.theme}
              illustrationSource={visual.illustration}
              illustrationResizeMode={visual.illustrationResizeMode}
              onCategoriesPress={() => router.push('/categories')}
              categoriesA11yLabel={t('tabs.categories')}
              categoriesA11yHint={t('home.heroBrowseA11y')}
              onSavedPress={() => router.push('/saved')}
              savedA11yLabel={t('saved.title')}
              savedA11yHint={t('home.heroSavedA11y')}
              onSettings={() => router.push('/settings')}
              settingsLabel={t('common.settings')}
            />
          }
        />
        <EmergencyButton />
      </View>
    );
  }

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
          tagline={tagline}
          theme={visual.theme}
          illustrationSource={visual.illustration}
          illustrationResizeMode={visual.illustrationResizeMode}
          onCategoriesPress={() => router.push('/categories')}
          categoriesA11yLabel={t('tabs.categories')}
          categoriesA11yHint={t('home.heroBrowseA11y')}
          onSavedPress={() => router.push('/saved')}
          savedA11yLabel={t('saved.title')}
          savedA11yHint={t('home.heroSavedA11y')}
          onSettings={() => router.push('/settings')}
          settingsLabel={t('common.settings')}
        />

        {slug === 'stay' ? (
          <StayHubBody lang={lang} listCopyNs={`hub.${slug}`} />
        ) : slug === 'work' ? (
          <WorkHubBody lang={lang} listCopyNs={`hub.${slug}`} />
        ) : slug === 'learn' ? (
          <LearnHubBody lang={lang} listCopyNs={`hub.${slug}`} />
        ) : slug === 'medical' ? (
          <CategoryPlacesHubBody categoryId={category.id} lang={lang} listCopyNs={`hub.${slug}`} />
        ) : (
          <CategoryHubBody categoryId={category.id} lang={lang} listCopyNs={`hub.${slug}`} />
        )}
      </ScrollView>
      <EmergencyButton />
    </View>
  );
}
