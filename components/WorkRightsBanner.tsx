import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

export function WorkRightsBanner({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  return (
    <View className="rounded-xl border border-work/40 bg-work/15 p-3">
      <Text style={{ fontFamily: f.medium }} className="text-sm leading-5 text-work">
        {t('common.workWarning')}
      </Text>
    </View>
  );
}
