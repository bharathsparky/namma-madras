import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Platform, ScrollView, StatusBar as RNStatusBar, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHubSwitcher } from '@/components/HomeHubSwitcher';
import {
  HomeMarketplaceCategoryStrip,
  HomeMarketplaceGreetingBar,
  HomeMarketplaceSearchPanel,
  useMarketplaceChromeLayout,
} from '@/components/HomeMarketplaceChrome';
import { IndependentAppTrustModal } from '@/components/IndependentAppTrustModal';
import { ReceptionHallHintBanner } from '@/components/ReceptionHallHintBanner';
import { marketplaceStatusBarTint } from '@/constants/asphalt';
import { getCategories } from '@/db/queries';
import { useHomeCategorySwipePan } from '@/hooks/useHomeCategorySwipePan';
import { useReceptionHallHint } from '@/hooks/useReceptionHallHint';
import { useIndependentAppTrustNotice } from '@/hooks/useIndependentAppTrustNotice';
import { useLanguageStore } from '@/stores/languageStore';

/** Bottom scroll padding (no tab bar; no floating SOS on this screen). */
const SCROLL_PAD_BOTTOM = 32;

export default function HomeScreen() {
  const lang = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [activeSlug, setActiveSlug] = useState('food');

  const categorySlugs = useMemo(() => getCategories(db).map((c) => c.slug), [db]);

  const onSelectCategory = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const hubSwipePanHandlers = useHomeCategorySwipePan(categorySlugs, activeSlug, onSelectCategory);

  const { hint: receptionHint, dismiss: dismissReceptionHint } = useReceptionHallHint();
  const { visible: trustNoticeVisible, acknowledge: acknowledgeTrustNotice } =
    useIndependentAppTrustNotice();

  const marketplaceLayout = useMarketplaceChromeLayout();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(marketplaceStatusBarTint);
        RNStatusBar.setTranslucent(false);
      }
      return () => {
        setStatusBarStyle('dark');
        if (Platform.OS === 'android') {
          RNStatusBar.setBackgroundColor('transparent');
          RNStatusBar.setTranslucent(true);
        }
      };
    }, []),
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView
        className="flex-1 bg-transparent"
        contentContainerStyle={{ paddingBottom: insets.bottom + SCROLL_PAD_BOTTOM }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
        nestedScrollEnabled
      >
        <HomeMarketplaceGreetingBar lang={lang} topInsetMode="belowStatusBar" compactStrip />
        <HomeMarketplaceCategoryStrip
          lang={lang}
          activeSlug={activeSlug}
          onSelectSlug={onSelectCategory}
          layout={marketplaceLayout}
          compactStrip
        />
        <HomeMarketplaceSearchPanel lang={lang} />
        {activeSlug === 'food' && receptionHint ? (
          <ReceptionHallHintBanner lang={lang} hint={receptionHint} onDismiss={dismissReceptionHint} />
        ) : null}
        <View {...hubSwipePanHandlers} collapsable={false}>
          <HomeHubSwitcher
            slug={activeSlug}
            lang={lang}
            bottomInset={insets.bottom}
            nestInParentScroll
          />
        </View>
      </ScrollView>
      <IndependentAppTrustModal
        visible={trustNoticeVisible}
        onAcknowledge={acknowledgeTrustNotice}
        lang={lang}
      />
    </SafeAreaView>
  );
}
