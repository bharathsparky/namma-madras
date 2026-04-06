import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

const FAB = 56;

/**
 * Emergency call FAB — pinned to the **bottom-right** of the screen (safe area).
 * Uses a full-screen `box-none` layer so `absolute` + `bottom` always resolves against the viewport,
 * not a zero-height parent (which can wrongly pin the button to the top on some layouts).
 */
export function EmergencyButton() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const right = Math.max(insets.right, 16);
  const bottom = Math.max(insets.bottom, 12) + 10;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.emergencyFab')}
        accessibilityHint={t('a11y.emergencyFabHint')}
        onPress={() => router.push('/emergency')}
        style={({ pressed }) => ({
          position: 'absolute',
          right,
          bottom,
          width: FAB,
          height: FAB,
          borderRadius: FAB / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.emergency,
          zIndex: 999,
          ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: '#101010',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
              }
            : {}),
          opacity: pressed ? 0.92 : 1,
        })}
      >
        <Ionicons name="call" size={26} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}
