import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { LEARN_NOTES } from '@/data/seeds/learn';
import type { Lang } from '@/db/types';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEnHi } from '@/utils/pickTaEn';

type Props = { lang: Lang };

/** Pinned tip — `LEARN_NOTES.quick_study_spots_*` (padaippagam + branch libraries). */
export function LearnQuickTipCard({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const body = pickTaEnHi(
    lang,
    LEARN_NOTES.quick_study_spots_ta,
    LEARN_NOTES.quick_study_spots_en,
    LEARN_NOTES.quick_study_spots_hi,
  );

  return (
    <View
      className="mb-4 rounded-xl border border-ink/12 bg-ink/[0.04] px-3.5 py-3"
      accessibilityRole="summary"
      accessibilityLabel={body}
    >
      <View className="flex-row items-start gap-2.5">
        <View
          className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: ui.neutralWash }}
          accessibilityElementsHidden
        >
          <Ionicons name="bulb-outline" size={20} color={colors.inkMuted} />
        </View>
        <View className="min-w-0 flex-1">
          <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-[0.08em] text-ink-muted">
            {t('hub.learn.quickTip')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1 text-[14px] leading-[21px] text-ink">
            {body}
          </Text>
        </View>
      </View>
    </View>
  );
}
