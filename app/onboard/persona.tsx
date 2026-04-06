import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/OnboardingShell';
import type { Persona } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';
import { colors } from '@/constants/theme';
import { usePersonaStore } from '@/stores/personaStore';

const TILES: {
  persona: Persona;
  icon: keyof typeof Ionicons.glyphMap;
  key: string;
  accent: string;
  iconColor: string;
}[] = [
  { persona: 'crisis', icon: 'warning-outline', key: 'pCrisis', accent: colors.emergency, iconColor: colors.emergency },
  { persona: 'migrant', icon: 'compass-outline', key: 'pMigrant', accent: colors.learn, iconColor: colors.learn },
  { persona: 'student', icon: 'school-outline', key: 'pStudent', accent: colors.work, iconColor: colors.work },
  { persona: 'helper', icon: 'people-outline', key: 'pHelper', accent: colors.primary, iconColor: colors.primary },
];

export default function OnboardPersonaScreen() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const f = useFontFamily(lang);
  const setPersona = usePersonaStore((s) => s.setPersona);

  return (
    <OnboardingShell step={2} onBack={() => router.back()}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Text style={{ fontFamily: f.bold }} className="text-center text-[24px] leading-[30px] text-ink">
          {t('onboarding.personaTitle')}
        </Text>
        <Text style={{ fontFamily: f.regular }} className="mt-2 text-center text-[15px] leading-[23px] text-ink-muted">
          {t('onboarding.personaSub')}
        </Text>

        <View className="mt-8 flex-row flex-wrap justify-between gap-y-4">
          {TILES.map((tile) => (
            <Pressable
              key={tile.persona}
              onPress={() => {
                void setPersona(tile.persona).then(() => router.push('/onboard/permissions'));
              }}
              className="mb-1 w-[48%] min-h-[136px] rounded-2xl border bg-surface-card-dark px-3 py-4 active:opacity-92"
              style={{ borderColor: `${tile.accent}33`, borderWidth: 1 }}
              accessibilityRole="button"
              accessibilityLabel={t(`onboarding.${tile.key}` as 'onboarding.pCrisis')}
            >
              <View
                className="self-start rounded-xl p-2.5"
                style={{ backgroundColor: `${tile.accent}18` }}
              >
                <Ionicons name={tile.icon} size={28} color={tile.iconColor} />
              </View>
              <Text style={{ fontFamily: f.medium }} className="mt-3 text-left text-[15px] leading-[22px] text-ink">
                {t(`onboarding.${tile.key}` as 'onboarding.pCrisis')}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}
