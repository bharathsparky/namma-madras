import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { FILTER_PILL_SQUIRCLE } from '@/constants/listToolbar';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

type Props = {
  lang: Lang;
  selected: boolean;
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
};

/**
 * Shared filter/sort pill — used across hub filter bars for consistent chrome and one place to tune styles.
 */
export const HubFilterPill = memo(function HubFilterPill({
  lang,
  selected,
  label,
  onPress,
  accessibilityHint,
}: Props) {
  const f = useFontFamily(lang);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityHint={accessibilityHint}
      style={FILTER_PILL_SQUIRCLE}
      className={`min-h-[36px] shrink-0 justify-center overflow-hidden border px-3.5 active:opacity-92 ${
        selected ? 'border-ink/22 bg-surface-inset' : 'border-ink/[0.10] bg-surface-card-dark'
      }`}
    >
      <Text
        style={{ fontFamily: f.medium }}
        className="text-[13px] leading-[18px] text-ink"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
});
