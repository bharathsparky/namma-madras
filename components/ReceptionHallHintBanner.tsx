import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Lang } from '@/db/types';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLocationStore } from '@/stores/locationStore';
import { openMapsSearchReceptionHallsNearby } from '@/utils/openDirections';
import type { ReceptionHallHint } from '@/utils/receptionHallContext';

type Props = {
  lang: Lang;
  hint: ReceptionHallHint;
  onDismiss: () => void;
};

/**
 * Compact strip — not a full card — for madabam / kalyana mandapam tips.
 */
export function ReceptionHallHintBanner({ lang, hint, onDismiss }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);

  const lineKey =
    hint.kind === 'aadi_note'
      ? 'home.receptionHall.bannerCompactAadi'
      : hint.kind === 'wedding_season_weekend'
        ? 'home.receptionHall.bannerCompactSeason'
        : 'home.receptionHall.bannerCompact';

  const line = t(lineKey);
  const a11yHint = t('home.receptionHall.bannerA11y');

  const openMaps = () => {
    void openMapsSearchReceptionHallsNearby(lat, lon);
  };

  return (
    <View className="mx-4 mt-2">
      <View className="flex-row overflow-hidden rounded-xl border border-ink/12 bg-ink/[0.04]">
        <Pressable
          onPress={openMaps}
          className="min-h-[48px] flex-1 flex-row items-center gap-2.5 px-3 py-2.5 active:bg-ink/[0.05]"
          accessibilityRole="button"
          accessibilityLabel={line}
          accessibilityHint={a11yHint}
        >
          <Ionicons name="sparkles-outline" size={18} color={colors.inkMuted} accessibilityElementsHidden />
          <Text
            style={{ fontFamily: f.medium }}
            className="min-w-0 flex-1 text-[13px] leading-[18px] text-ink/88"
            numberOfLines={2}
          >
            {line}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} accessibilityElementsHidden />
        </Pressable>
        <Pressable
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-11 items-center justify-center border-l border-ink/10 active:bg-ink/[0.04]"
          accessibilityRole="button"
          accessibilityLabel={t('home.receptionHall.dismiss')}
        >
          <Ionicons name="close" size={20} color={colors.inkMuted} />
        </Pressable>
      </View>
    </View>
  );
}
