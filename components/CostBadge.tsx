import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CostType, Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

export function CostBadge({
  lang,
  costType,
  noteText,
}: {
  lang: Lang;
  costType: CostType;
  noteText?: string | null;
}) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const label =
    costType === 'free'
      ? t('common.free')
      : costType === 'subsidised'
        ? t('common.subsidised')
        : t('common.paid');
  const bg =
    costType === 'free'
      ? 'bg-badge-free/22 border-badge-free/55'
      : costType === 'subsidised'
        ? 'bg-badge-subsidised/22 border-badge-subsidised/55'
        : 'bg-ink/10 border-ink/22';
  const tc =
    costType === 'free'
      ? 'text-badge-free'
      : costType === 'subsidised'
        ? 'text-badge-subsidised'
        : 'text-ink-muted';
  return (
    <View className={`max-w-[140px] rounded-full border px-2.5 py-1 ${bg}`} accessibilityRole="text" accessibilityLabel={noteText ? `${label}, ${noteText}` : label}>
      <Text style={{ fontFamily: f.medium }} className={`text-[13px] leading-4 ${tc}`} numberOfLines={2}>
        {noteText ? `${label} · ${noteText}` : label}
      </Text>
    </View>
  );
}
