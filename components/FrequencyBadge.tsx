import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Frequency, Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

function freqLabel(f: Frequency, t: (k: string) => string): string {
  if (f === 'daily') return t('common.daily');
  if (f === 'weekly') return t('common.freqWeekly');
  if (f === 'on_call') return t('common.onCall');
  return t('common.freqPeriodic');
}

export function FrequencyBadge({ lang, frequency }: { lang: Lang; frequency: Frequency }) {
  const { t } = useTranslation();
  const font = useFontFamily(lang);
  const label = freqLabel(frequency, t);
  return (
    <View
      className="rounded-full border border-ink/16 bg-ink/8 px-2.5 py-1"
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={{ fontFamily: font.medium }} className="text-xs text-ink-muted" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
