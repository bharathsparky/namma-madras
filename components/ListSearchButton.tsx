import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { HIT_SLOP_COMFORT } from '@/constants/a11y';
import { colors } from '@/constants/theme';

type Props = {
  categoryId: number;
  accessibilityLabel: string;
};

/** Opens `/search` scoped to one category (see `searchPlaces`). */
export function ListSearchButton({ categoryId, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/search?categoryId=${categoryId}` as never)}
      hitSlop={HIT_SLOP_COMFORT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:bg-ink/[0.06]"
    >
      <Ionicons name="search-outline" size={24} color={colors.inkMuted} />
    </Pressable>
  );
}
