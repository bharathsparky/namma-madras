import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
import { useSettingsStore } from '@/stores/settingsStore';

function SettingsSectionLabel({
  children,
  f,
  first,
}: {
  children: string;
  f: { bold: string };
  first?: boolean;
}) {
  return (
    <Text
      style={{ fontFamily: f.bold }}
      className={`mb-2 px-1 text-[11px] uppercase tracking-[0.14em] text-ink-faint ${first ? 'mt-0' : 'mt-6'}`}
    >
      {children}
    </Text>
  );
}

function SettingsNavRow({
  icon,
  label,
  hint,
  onPress,
  f,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
  f: ReturnType<typeof useFontFamily>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      className="min-h-[52px] flex-row items-center gap-3 rounded-2xl border border-ink/[0.08] bg-surface-card-dark px-3.5 py-2.5 active:bg-ink/[0.04]"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/12">
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text style={{ fontFamily: f.medium }} className="text-[15px] leading-5 text-ink" numberOfLines={2}>
          {label}
        </Text>
        {hint ? (
          <Text style={{ fontFamily: f.regular }} className="mt-0.5 text-xs leading-4 text-ink-muted" numberOfLines={2}>
            {hint}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const tamilNumerals = useSettingsStore((s) => s.tamilNumerals);
  const setTamilNumerals = useSettingsStore((s) => s.setTamilNumerals);
  const v = Constants.expoConfig?.version ?? '1.0.0';

  const showPrivacy = () => {
    Alert.alert(t('settings.privacySheetTitle'), t('settings.privacySheetBody'), [
      { text: t('settings.privacyDismiss'), style: 'default' },
    ]);
  };

  return (
    <View className="flex-1 bg-surface-dark">
      <ScreenHeader
        title={t('settings.title')}
        lang={lang}
        variant="brand"
        onBackPress={() => router.back()}
      />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSectionLabel f={f} first>
          {t('settings.sectionLanguageDisplay')}
        </SettingsSectionLabel>
        <View className="rounded-2xl border border-ink/[0.08] bg-surface-card-dark p-3.5">
          <View className="flex-row flex-wrap gap-2.5">
            <Pressable
              onPress={() => void setLanguage('ta')}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.switchTamil')}
              accessibilityState={{ selected: lang === 'ta' }}
              className={`min-h-[48px] min-w-[31%] flex-1 items-center justify-center rounded-xl border-2 ${
                lang === 'ta' ? 'border-primary bg-primary/10' : 'border-ink/10 bg-surface-inset/50'
              } active:opacity-90`}
            >
              <Text
                style={{ fontFamily: f.bold }}
                className={`text-base ${lang === 'ta' ? 'text-primary' : 'text-ink'}`}
              >
                தமிழ்
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void setLanguage('en')}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.switchEnglish')}
              accessibilityState={{ selected: lang === 'en' }}
              className={`min-h-[48px] min-w-[31%] flex-1 items-center justify-center rounded-xl border-2 ${
                lang === 'en' ? 'border-primary bg-primary/10' : 'border-ink/10 bg-surface-inset/50'
              } active:opacity-90`}
            >
              <Text
                style={{ fontFamily: f.bold }}
                className={`text-base ${lang === 'en' ? 'text-primary' : 'text-ink'}`}
              >
                English
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void setLanguage('hi')}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.switchHindi')}
              accessibilityState={{ selected: lang === 'hi' }}
              className={`min-h-[48px] min-w-[31%] flex-1 items-center justify-center rounded-xl border-2 ${
                lang === 'hi' ? 'border-primary bg-primary/10' : 'border-ink/10 bg-surface-inset/50'
              } active:opacity-90`}
            >
              <Text
                style={{ fontFamily: f.bold }}
                className={`text-base ${lang === 'hi' ? 'text-primary' : 'text-ink'}`}
              >
                हिन्दी
              </Text>
            </Pressable>
          </View>
          <View className="my-3 h-px bg-ink/[0.08]" />
          <View className="min-h-[52px] flex-row items-center justify-between gap-3">
            <View className="min-w-0 flex-1 pr-2">
              <Text style={{ fontFamily: f.medium }} className="text-[15px] leading-5 text-ink">
                {t('common.tamilNumerals')}
              </Text>
              <Text style={{ fontFamily: f.regular }} className="mt-1 text-xs leading-4 text-ink-muted">
                {t('settings.tamilNumeralsSub')}
              </Text>
            </View>
            <Switch
              value={tamilNumerals}
              onValueChange={(next) => void setTamilNumerals(next)}
              trackColor={{ false: colors.surfaceInset, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? (tamilNumerals ? colors.onPrimary : ui.switchThumbOff) : undefined}
              ios_backgroundColor={colors.surfaceInset}
              accessibilityLabel={t('common.tamilNumerals')}
            />
          </View>
        </View>

        <SettingsSectionLabel f={f}>{t('settings.sectionEmergency')}</SettingsSectionLabel>
        <View className="gap-2">
          <SettingsNavRow
            icon="call-outline"
            label={t('emergency.title')}
            hint={t('settings.linkEmergencySub')}
            onPress={() => router.push('/emergency')}
            f={f}
          />
        </View>

        <SettingsSectionLabel f={f}>{t('settings.sectionDevice')}</SettingsSectionLabel>
        <View className="gap-2">
          <SettingsNavRow
            icon="location-outline"
            label={t('settings.linkLocation')}
            hint={t('settings.linkLocationSub')}
            onPress={() => void Linking.openSettings()}
            f={f}
          />
        </View>

        <SettingsSectionLabel f={f}>{t('settings.sectionAbout')}</SettingsSectionLabel>
        <View className="gap-3">
          <Pressable
            onPress={showPrivacy}
            accessibilityRole="button"
            accessibilityLabel={t('common.privacy')}
            className="min-h-[52px] flex-row items-center justify-between rounded-2xl border border-ink/[0.08] bg-surface-card-dark px-4 py-3.5 active:bg-ink/[0.04]"
          >
            <View className="min-w-0 flex-1 pr-3">
              <Text style={{ fontFamily: f.medium }} className="text-[15px] text-ink">
                {t('common.privacy')}
              </Text>
              <Text style={{ fontFamily: f.regular }} className="mt-1 text-xs text-ink-muted">
                {t('settings.privacyRowSub')}
              </Text>
            </View>
            <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
          </Pressable>

          <Text
            style={{ fontFamily: f.regular }}
            className="text-center text-[12px] leading-4 text-ink-faint"
          >
            {t('settings.aboutLine', { v })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
