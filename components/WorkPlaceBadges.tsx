import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';

type Props = {
  lang: Lang;
  isGovt: boolean;
};

/** Govt scheme badge only — cost is omitted (work hub listings are free to use). */
export function WorkPlaceBadges({ lang, isGovt }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  if (!isGovt) return null;
  return (
    <View className="mt-2.5 flex-row flex-wrap gap-2">
      <View className="rounded-full border border-stay/28 bg-stay/12 px-2.5 py-1">
        <Text style={{ fontFamily: f.bold }} className="text-[11px] leading-4 text-stay">
          {t('hub.work.badgeGovt')}
        </Text>
      </View>
    </View>
  );
}
