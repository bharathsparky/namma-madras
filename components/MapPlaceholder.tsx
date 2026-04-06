import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';

export function MapPlaceholder({ address, lang = 'en' }: { address: string; lang?: Lang }) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  return (
    <View className="flex-1 items-center justify-center rounded-2xl border border-dashed border-ink/18 bg-surface-inset/80 px-6">
      <Ionicons name="cloud-offline-outline" size={36} color={ui.inkIcon22} />
      <Text style={{ fontFamily: f.medium }} className="mt-3 text-center text-sm text-ink-muted">
        {t('common.mapUnavailableOffline')}
      </Text>
      <Text style={{ fontFamily: f.regular }} className="mt-1 text-center text-sm text-ink-faint">
        {address}
      </Text>
    </View>
  );
}
