import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GCC_SHELTER_COORDINATOR } from '@/data/seeds/stay';
import { listingCardOutline } from '@/constants/listingCardChrome';
import { listingCardLift } from '@/constants/elevation';
import { colors } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

const GCC_LOGO = require('../assets/images/gcc-greater-chennai-corporation.webp');

const STAY = colors.stay;
const LOGO_BOX = 38;

type Props = { lang: Lang };

/**
 * Stay-hub GCC coordinator — compact row: logo, coordinator name + role, call action.
 */
export function GccCoordinatorCard({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const tel = GCC_SHELTER_COORDINATOR.phone.replace(/\D/g, '');

  const onCall = () => void Linking.openURL(`tel:${tel}`);

  return (
    <View
      accessible={false}
      className="mb-2 overflow-hidden rounded-xl bg-surface-card-dark px-3 py-2.5"
      style={[listingCardLift, listingCardOutline.brand]}
    >
      <View className="flex-row items-center gap-2.5">
        <View
          style={styles.logoBox}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <Image
            source={GCC_LOGO}
            style={{ width: LOGO_BOX - 2, height: LOGO_BOX - 2, alignSelf: 'center' }}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        <View className="min-w-0 flex-1">
          <Text style={[styles.overline, { fontFamily: f.bold }]}>{t('hub.stay.coordinatorOverline')}</Text>
          <Text
            style={[styles.name, { fontFamily: f.bold }]}
            numberOfLines={2}
            accessibilityRole="header"
          >
            {GCC_SHELTER_COORDINATOR.name}
          </Text>
          <Text style={[styles.phone, { fontFamily: f.medium }]} accessibilityElementsHidden>
            {GCC_SHELTER_COORDINATOR.phone}
          </Text>
          <Text style={[styles.roleShort, { fontFamily: f.regular }]} numberOfLines={2}>
            {t('hub.stay.coordinatorRoleShort')}
          </Text>
        </View>

        <Pressable
          onPress={onCall}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t('hub.stay.coordinatorCallA11y', { phone: GCC_SHELTER_COORDINATOR.phone })}
          className="h-11 min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-ink/[0.09] bg-surface-inset/90 active:bg-ink/[0.06] active:opacity-95"
        >
          <Ionicons name="call" size={18} color={STAY} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    width: LOGO_BOX,
    height: LOGO_BOX,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'rgba(61, 122, 184, 0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(22, 26, 25, 0.08)',
  },
  overline: {
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: STAY,
  },
  name: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
  },
  phone: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.2,
    color: colors.inkMuted,
  },
  roleShort: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: colors.inkMuted,
  },
});
