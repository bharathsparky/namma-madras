import { Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { localeForLang } from '@/utils/localeForLang';

export function HomeTimeHero({
  now,
  lang,
  label,
}: {
  now: Date;
  lang: Lang;
  label: string;
}) {
  const f = useFontFamily(lang);
  const locale = localeForLang(lang);
  const timeStr = now.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: lang !== 'ta',
  });
  const dateStr = now.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View className="mt-2">
      <Text
        style={{ fontFamily: f.medium }}
        className="text-[11px] uppercase tracking-[0.16em] text-ink-faint"
        accessibilityRole="text"
      >
        {label}
      </Text>
      <Text
        style={{ fontFamily: f.bold }}
        className="mt-1 text-[46px] leading-[52px] tracking-tight text-ink"
        accessibilityRole="text"
        accessibilityLabel={`${label}, ${timeStr}, ${dateStr}`}
      >
        {timeStr}
      </Text>
      <Text style={{ fontFamily: f.regular }} className="mt-1 text-base text-ink-muted" numberOfLines={2}>
        {dateStr}
      </Text>
    </View>
  );
}
