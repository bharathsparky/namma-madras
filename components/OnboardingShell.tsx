import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { colors, onboarding } from '@/constants/theme';

type Props = {
  step: number;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  /** Taller gradient wash for the welcome step */
  hero?: boolean;
  /** e.g. Skip — replaces the empty top-right slot */
  topRight?: ReactNode;
};

export function OnboardingShell({ step, children, footer, onBack, hero, topRight }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-transparent">
      <LinearGradient
        colors={[onboarding.wash, 'rgba(243, 244, 246, 0)', colors.surfaceDark]}
        locations={[0, 0.45, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: hero ? 300 : 200,
        }}
      />
      <View
        className="flex-1 px-5"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 12,
        }}
      >
        <View className="mb-5 flex-row items-start">
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl active:bg-ink/8"
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Ionicons name="chevron-back" size={26} color={onboarding.teal} />
            </Pressable>
          ) : (
            <View className="h-11 w-11" />
          )}
          <View className="flex-1 items-center pt-1">
            <OnboardingProgress step={step} />
          </View>
          {topRight != null ? (
            <View className="min-h-[44px] min-w-[44px] items-end justify-center">{topRight}</View>
          ) : (
            <View className="h-11 w-11" />
          )}
        </View>
        <View className="flex-1">{children}</View>
        {footer}
      </View>
    </View>
  );
}
