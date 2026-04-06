import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WORK_REGISTRATION_GUIDE } from '@/data/seeds/work';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEnHi } from '@/utils/pickTaEn';

type Props = { lang: Lang };

export function WorkRegistrationGuideCard({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const g = WORK_REGISTRATION_GUIDE;

  const priority = pickTaEnHi(lang, g.priority_ta, g.priority_en, g.priority_hi);

  return (
    <View className="mb-4 rounded-2xl border border-work/25 bg-work/8 px-4 py-3.5">
      <Text style={{ fontFamily: f.bold }} className="text-[13px] uppercase tracking-[0.1em] text-work">
        {t('hub.work.registrationGuideTitle')}
      </Text>
      <Text style={{ fontFamily: f.medium }} className="mt-2 text-[14px] leading-5 text-ink/88">
        {priority}
      </Text>
      <View className="mt-3 gap-3">
        {g.steps.map((s) => {
          const action = pickTaEnHi(lang, s.action_ta, s.action_en, s.action_hi);
          const benefit = pickTaEnHi(lang, s.benefit_ta, s.benefit_en, s.benefit_hi);
          return (
            <View key={s.step} className="flex-row gap-3">
              <View className="mt-0.5 h-7 min-w-[28px] items-center justify-center rounded-full bg-work/20">
                <Text style={{ fontFamily: f.bold }} className="text-[14px] text-work">
                  {s.step}
                </Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text style={{ fontFamily: f.medium }} className="text-[15px] leading-[21px] text-ink">
                  {action}
                </Text>
                <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-5 text-ink-muted">
                  {benefit}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View className="mt-4 border-t border-ink/10 pt-3">
        <Text style={{ fontFamily: f.medium }} className="text-[12px] uppercase tracking-[0.08em] text-ink-muted">
          {t('hub.work.documentsLabel')}
        </Text>
        <Text style={{ fontFamily: f.regular }} className="mt-1.5 text-[13px] leading-5 text-ink/88">
          {pickTaEnHi(lang, g.documents_needed_ta, g.documents_needed_en, g.documents_needed_hi)}
        </Text>
      </View>
    </View>
  );
}
