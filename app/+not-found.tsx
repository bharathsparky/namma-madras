import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-surface-dark px-5">
        <Text className="text-center text-lg text-white/80">This screen does not exist.</Text>
        <Link href="/" className="mt-6 min-h-[48px] justify-center py-3">
          <Text className="text-base text-primary">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
