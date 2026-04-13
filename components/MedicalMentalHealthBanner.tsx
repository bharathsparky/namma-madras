import { useTranslation } from 'react-i18next';
import { Linking, Pressable, Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn } from '@/utils/pickTaEn';

const ROWS: { labelEn: string; labelTa: string; phone: string }[] = [
  { labelEn: 'iCall', labelTa: 'iCall', phone: '9152987821' },
  { labelEn: 'SNEHI', labelTa: 'SNEHI', phone: '04424640050' },
  { labelEn: 'Vandrevala 24/7', labelTa: 'வந்தரேவாலா', phone: '18602662345' },
];

export function MedicalMentalHealthBanner({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);

  return (
    <View className="rounded-2xl border border-ink/12 bg-surface-card-dark p-4">
      <Text style={{ fontFamily: f.medium }} className="text-sm leading-5 text-ink">
        {t('common.mentalHealthBanner')}
      </Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {ROWS.map((r) => (
          <Pressable
            key={r.phone}
            onPress={() => void Linking.openURL(`tel:${r.phone.replace(/\D/g, '')}`)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-ink/10 bg-surface-inset/90 px-3 py-2 active:opacity-88"
            accessibilityRole="button"
          >
            <Text style={{ fontFamily: f.bold }} className="text-xs text-ink-muted">
              {pickTaEn(lang, r.labelTa, r.labelEn)}
            </Text>
            <Text style={{ fontFamily: f.medium }} className="text-sm text-ink">
              {r.phone}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
