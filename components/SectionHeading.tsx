import type { ReactNode } from 'react';
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
  right,
}: {
  title: string;
  overline?: string;
  lang: Lang;
  /** e.g. mt-6 vs mt-8 */
  className?: string;
  /** e.g. list search — aligned to top-right of the heading block */
  right?: ReactNode;
}) {
  const f = useFontFamily(lang);
  return (
    <View className={`flex-row items-start gap-3 ${className}`}>
      <View className="mt-[5px] w-[3px] self-stretch rounded-full bg-ink/25" />
      <View className="min-w-0 flex-1">
        {overline ? (
          <Text
            style={{ fontFamily: f.medium }}
            className="text-[11px] uppercase tracking-[0.12em] text-ink-muted"
            numberOfLines={1}
          >
            {overline}
          </Text>
        ) : null}
        <Text
          style={{ fontFamily: f.bold }}
          className={`text-[17px] leading-[22px] tracking-[-0.2px] text-ink ${overline ? 'mt-1' : ''}`}
          numberOfLines={3}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
      {right != null ? <View className="mt-[3px] flex-shrink-0">{right}</View> : null}
    </View>
  );
}
