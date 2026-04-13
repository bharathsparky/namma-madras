import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surfaceDark },
        animation: 'none',
      }}
    >
      <Stack.Screen name="language" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
