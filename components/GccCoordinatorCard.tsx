import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GCC_SHELTER_COORDINATOR } from '@/data/seeds/stay';
import { colors } from '@/constants/theme';
import { elevationSoft } from '@/constants/elevation';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

type Props = { lang: Lang };

/**
 * GCC overall shelter coordinator — always shown at top of Stay hub.
 */
export function GccCoordinatorCard({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const tel = GCC_SHELTER_COORDINATOR.phone.replace(/\D/g, '');

  return (
    <View
      className="mb-3 overflow-hidden rounded-2xl border border-ink/10 border-l-[3px] border-l-primary bg-surface-card-dark px-4 py-3"
      style={elevationSoft}
      accessibilityRole="summary"
      accessibilityLabel={`${GCC_SHELTER_COORDINATOR.name}. ${GCC_SHELTER_COORDINATOR.role}. ${t('hub.stay.coordinatorA11y')}`}
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-full bg-primary/14">
          <Ionicons name="person-outline" size={22} color={colors.primary} accessibilityElementsHidden />
        </View>
        <View className="min-w-0 flex-1">
          <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-[0.12em] text-primary">
            {t('hub.stay.coordinatorOverline')}
          </Text>
          <Text style={{ fontFamily: f.bold }} className="mt-1 text-[16px] leading-5 text-ink">
            {GCC_SHELTER_COORDINATOR.name}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-5 text-ink-muted">
            {GCC_SHELTER_COORDINATOR.role}
          </Text>
          <Pressable
            onPress={() => void Linking.openURL(`tel:${tel}`)}
            className="mt-3 min-h-[44px] flex-row items-center self-start rounded-xl bg-primary px-4 py-2.5 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={t('hub.stay.coordinatorCallA11y', { phone: GCC_SHELTER_COORDINATOR.phone })}
          >
            <Ionicons name="call" size={18} color={colors.onPrimary} />
            <Text style={{ fontFamily: f.bold }} className="ml-2 text-[15px] text-on-primary">
              {GCC_SHELTER_COORDINATOR.phone}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
