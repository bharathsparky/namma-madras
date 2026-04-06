import { router, useFocusEffect, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import * as Linking from 'expo-linking';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeSuperAppHero } from '@/components/HomeSuperAppHero';
import { emergencyHubVisual } from '@/constants/categoryHubVisual';
import { getEmergencyContacts } from '@/db/queries';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLiveClock } from '@/hooks/useLiveClock';
import { useLanguageStore } from '@/stores/languageStore';
import { getHomeContext } from '@/utils/homeContext';
import { localeForLang } from '@/utils/localeForLang';
import { pickTaEn } from '@/utils/pickTaEn';

const LIST_BOTTOM_PAD = 28;

export default function EmergencyScreen() {
  const { t } = useTranslation();
  const nav = useRouter();
  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const now = useLiveClock(30000);
  const ctx = useMemo(() => getHomeContext(now), [now]);

  const goBack = useCallback(() => {
    if (nav.canGoBack()) nav.back();
    else nav.replace('/home');
  }, [nav]);

  const rows = useMemo(() => getEmergencyContacts(db), [db]);

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

  const listHeader = useMemo(
    () => (
      <>
        <HomeSuperAppHero
          lang={lang}
          greetingLine={heroGreeting}
          timeLine={heroTime}
          timeAccessibilityLabel={heroTimeA11y}
          tagline={t('hub.emergency.heroTagline')}
          theme={emergencyHubVisual.theme}
          illustrationSource={emergencyHubVisual.illustration}
          onCategoriesPress={() => router.push('/categories')}
          categoriesA11yLabel={t('tabs.categories')}
          categoriesA11yHint={t('home.heroBrowseA11y')}
          onSavedPress={() => router.push('/saved')}
          savedA11yLabel={t('saved.title')}
          savedA11yHint={t('home.heroSavedA11y')}
          onSettings={() => router.push('/settings')}
          settingsLabel={t('common.settings')}
          onBackPress={goBack}
          backA11yLabel={t('common.back')}
        />
        <View className="px-5 pt-2 pb-4">
          <Text style={{ fontFamily: f.medium }} className="text-[15px] leading-[23px] text-ink-muted">
            {t('emergency.subtitle')}
          </Text>
        </View>
      </>
    ),
    [lang, heroGreeting, heroTime, heroTimeA11y, t, f.medium, goBack],
  );

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  return (
    <View className="flex-1 bg-surface-dark">
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        removeClippedSubviews={Platform.OS === 'android'}
        numColumns={2}
        ListHeaderComponent={listHeader}
        columnWrapperStyle={{ gap: 16, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + LIST_BOTTOM_PAD, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const label = pickTaEn(lang, item.label_ta, item.label_en);
          const tel = item.phone.replace(/\D/g, '');
          return (
            <Pressable
              onPress={() => void Linking.openURL(`tel:${tel}`)}
              className="min-h-[76px] flex-1 max-w-[50%] overflow-hidden rounded-2xl border border-ink/10 bg-surface-card-dark pl-0 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel={`${label} ${item.phone}`}
            >
              <View className="flex-row">
                <View className="w-1 self-stretch bg-emergency/90" />
                <View className="flex-1 p-3">
                  <Text style={{ fontFamily: f.bold }} className="text-sm text-ink/95" numberOfLines={3}>
                    {label}
                  </Text>
                  <Text style={{ fontFamily: f.medium }} className="mt-2 text-lg text-emergency">
                    {item.phone}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
