import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { OFFICIAL_SOURCE_LINKS } from '@/constants/officialSources';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';

export default function DataSourcesScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();

  const openUrl = (url: string) => {
    void Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title={t('dataSources.title')}
        lang={lang}
        variant="surface"
        onBackPress={() => router.back()}
      />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-2xl border-2 px-4 py-4"
          style={{ borderColor: colors.primary, backgroundColor: ui.primaryWash }}
          accessibilityRole="summary"
        >
          <Text style={{ fontFamily: f.bold }} className="text-[15px] leading-5 text-ink">
            {t('dataSources.disclaimerHeading')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-3 text-[14px] leading-[22px] text-ink/92">
            {t('dataSources.disclaimerP1')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-3 text-[14px] leading-[22px] text-ink/92">
            {t('dataSources.disclaimerP2')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-3 text-[14px] leading-[22px] text-ink/92">
            {t('dataSources.disclaimerP3')}
          </Text>
        </View>

        <Text
          style={{ fontFamily: f.bold }}
          className="mb-2 mt-8 px-1 text-[11px] uppercase tracking-[0.14em] text-ink-faint"
        >
          {t('dataSources.sourcesHeading')}
        </Text>

        <View className="gap-2">
          {OFFICIAL_SOURCE_LINKS.map((item) => (
            <Pressable
              key={item.url}
              onPress={() => openUrl(item.url)}
              accessibilityRole="link"
              accessibilityLabel={`${t(item.labelKey)}. ${item.url}`}
              className="min-h-[52px] flex-row items-center gap-3 rounded-2xl border border-ink/[0.08] bg-surface-card-dark px-3.5 py-3 active:bg-ink/[0.04]"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-ink/[0.08]">
                <Ionicons name="open-outline" size={20} color={colors.primary} />
              </View>
              <View className="min-w-0 flex-1">
                <Text style={{ fontFamily: f.medium }} className="text-[15px] leading-5 text-ink">
                  {t(item.labelKey)}
                </Text>
                <Text
                  style={{ fontFamily: f.regular }}
                  className="mt-0.5 text-[12px] leading-4 text-ink-muted"
                  numberOfLines={2}
                >
                  {item.url}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
            </Pressable>
          ))}
        </View>

        <Text style={{ fontFamily: f.regular }} className="mt-8 text-[13px] leading-5 text-ink-muted">
          {t('dataSources.footerNote')}
        </Text>
      </ScrollView>
    </View>
  );
}
