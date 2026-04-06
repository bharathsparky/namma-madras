import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function OnboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surfaceDark },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="persona" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
