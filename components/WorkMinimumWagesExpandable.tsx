import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TN_MINIMUM_WAGES } from '@/data/seeds/work';
import { colors } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEnHi } from '@/utils/pickTaEn';
import { useSettingsStore } from '@/stores/settingsStore';
import { toTamilNumerals } from '@/utils/tamilNumerals';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = { lang: Lang };

export function WorkMinimumWagesExpandable({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const tamilNumerals = useSettingsStore((s) => s.tamilNumerals);
  const [open, setOpen] = useState(false);
  const w = TN_MINIMUM_WAGES;
  const note = pickTaEnHi(lang, w.note_ta, w.note_en, w.note_hi);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  const formatRupee = (amount: number) => {
    if (lang === 'ta' && tamilNumerals) {
      return `₹${toTamilNumerals(amount, 0)}`;
    }
    return `₹${amount}`;
  };

  return (
    <View className="mb-2 overflow-hidden rounded-2xl border border-ink/10 bg-surface-inset/60">
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="min-h-[52px] flex-row items-center justify-between gap-3 px-4 py-3 active:bg-ink/[0.04]"
      >
        <Text style={{ fontFamily: f.bold }} className="flex-1 text-[16px] leading-[22px] text-ink">
          {t('hub.work.knowYourRights')}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.inkMuted} />
      </Pressable>

      {open ? (
        <View className="border-t border-ink/8 px-4 pb-4 pt-1">
          <Text style={{ fontFamily: f.regular }} className="text-[13px] leading-5 text-ink-muted">
            {note}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-2 text-[12px] text-ink-faint">
            {t('hub.work.minimumWageEffective', { date: w.effective_date })}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1 text-[12px] text-ink-faint">
            {t('hub.work.minimumWageSource', { source: w.source })}
          </Text>

          <View className="mt-3 overflow-hidden rounded-xl border border-ink/8 bg-surface-card-dark">
            <View className="flex-row border-b border-ink/8 bg-ink/[0.04] px-3 py-2">
              <Text style={{ fontFamily: f.bold }} className="flex-[2] text-[12px] text-ink">
                {t('hub.work.wageTableTrade')}
              </Text>
              <Text style={{ fontFamily: f.bold }} className="flex-1 text-right text-[12px] text-ink">
                {t('hub.work.wageTableMinDay')}
              </Text>
            </View>
            {w.trades.map((row, i) => {
              const trade = pickTaEnHi(lang, row.trade_ta, row.trade_en, row.trade_hi);
              return (
                <View
                  key={`${row.trade_en}-${i}`}
                  className={`flex-row px-3 py-2.5 ${i < w.trades.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
                >
                  <Text style={{ fontFamily: f.regular }} className="flex-[2] pr-2 text-[13px] leading-5 text-ink/88">
                    {trade}
                  </Text>
                  <Text style={{ fontFamily: f.medium }} className="flex-1 text-right text-[13px] text-ink">
                    {formatRupee(row.min_day)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
