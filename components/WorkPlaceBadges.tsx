import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';

type Props = {
  lang: Lang;
  isGovt: boolean;
  isFreeToUse: boolean;
};

/** Blue Govt + green Free — single row, calmer contrast for work cards. */
export function WorkPlaceBadges({ lang, isGovt, isFreeToUse }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  if (!isGovt && !isFreeToUse) return null;
  return (
    <View className="mt-2.5 flex-row flex-wrap gap-2">
      {isGovt ? (
        <View className="rounded-full border border-stay/28 bg-stay/12 px-2.5 py-1">
          <Text style={{ fontFamily: f.bold }} className="text-[11px] leading-4 text-stay">
            {t('hub.work.badgeGovt')}
          </Text>
        </View>
      ) : null}
      {isFreeToUse ? (
        <View className="rounded-full border border-badge-open/30 bg-badge-open/10 px-2.5 py-1">
          <Text style={{ fontFamily: f.bold }} className="text-[11px] leading-4 text-badge-open">
            {t('hub.work.badgeFree')}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
