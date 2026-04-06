import { Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

type Status = 'open' | 'closed' | 'upcoming';

/** Stronger borders / backgrounds for small-type readability (WCAG-minded on dark UI). */
const ring: Record<Status, string> = {
  open: 'border-badge-open/65 bg-badge-open/22',
  closed: 'border-badge-closed/65 bg-badge-closed/20',
  upcoming: 'border-badge-upcoming/65 bg-badge-upcoming/22',
};

const text: Record<Status, string> = {
  open: 'text-badge-open',
  closed: 'text-badge-closed',
  upcoming: 'text-badge-upcoming',
};

export function StatusChip({
  lang,
  status,
  label,
}: {
  lang: Lang;
  status: Status;
  label: string;
}) {
  const f = useFontFamily(lang);
  return (
    <View
      className={`rounded-full border px-2.5 py-1 ${ring[status]}`}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={{ fontFamily: f.medium }} className={`text-[13px] leading-4 ${text[status]}`} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}
