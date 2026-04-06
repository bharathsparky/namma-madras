import { Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

/**
 * Editorial section title — left accent rail + optional overline (breaks “anonymous card stack” rhythm).
 */
export function SectionHeading({
  title,
  overline,
  lang,
  className = '',
}: {
  title: string;
  overline?: string;
  lang: Lang;
  /** e.g. mt-6 vs mt-8 */
  className?: string;
}) {
  const f = useFontFamily(lang);
  return (
    <View className={`flex-row gap-3 ${className}`}>
      <View className="mt-1 w-1 self-stretch rounded-full bg-primary/75" />
      <View className="min-w-0 flex-1">
        {overline ? (
          <Text
            style={{ fontFamily: f.medium }}
            className="text-[11px] uppercase tracking-[0.14em] text-primary"
            numberOfLines={1}
          >
            {overline}
          </Text>
        ) : null}
        <Text
          style={{ fontFamily: f.bold }}
          className={`text-lg leading-6 text-ink ${overline ? 'mt-1' : ''}`}
          numberOfLines={3}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
