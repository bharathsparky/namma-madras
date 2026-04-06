import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';

type Props = {
  lang: Lang;
  body: string;
  quickTipLabel: string;
};

/** Tip card (bath / clothes / barber section intros) — matches Learn quick-tip rhythm. */
export function HygieneQuickTipCard({ lang, body, quickTipLabel }: Props) {
  const f = useFontFamily(lang);

  return (
    <View
      className="rounded-xl border border-primary/18 bg-primary/[0.07] px-3.5 py-3"
      accessibilityRole="summary"
      accessibilityLabel={body}
    >
      <View className="flex-row items-start gap-2.5">
        <View
          className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: ui.primaryWash }}
          accessibilityElementsHidden
        >
          <Ionicons name="bulb-outline" size={20} color={colors.primary} />
        </View>
        <View className="min-w-0 flex-1">
          <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-[0.08em] text-primary">
            {quickTipLabel}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1 text-[14px] leading-[21px] text-ink">
            {body}
          </Text>
        </View>
      </View>
    </View>
  );
}
