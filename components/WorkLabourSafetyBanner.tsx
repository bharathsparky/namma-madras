import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LABOUR_RIGHTS } from '@/data/seeds/work';
import { colors } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEnHi } from '@/utils/pickTaEn';

const STORAGE_KEY = '@csg/work_safety_banner_dismissed';

type Props = { lang: Lang };

export function WorkLabourSafetyBanner({ lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && v !== '1') setVisible(true);
      } catch {
        if (!cancelled) setVisible(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }, []);

  if (!visible) return null;

  const body = pickTaEnHi(
    lang,
    LABOUR_RIGHTS.safety_tip_ta,
    LABOUR_RIGHTS.safety_tip_en,
    LABOUR_RIGHTS.safety_tip_hi,
  );

  return (
    <View className="mb-3 rounded-xl border border-badge-upcoming/25 bg-badge-upcoming/10 px-3.5 py-3">
      <View className="flex-row items-start gap-2">
        <Ionicons name="warning-outline" size={22} color={colors.badgeUpcoming} style={{ marginTop: 1 }} />
        <View className="min-w-0 flex-1">
          <Text style={{ fontFamily: f.medium }} className="text-[14px] leading-5 text-ink/90">
            {body}
          </Text>
          <Pressable
            onPress={dismiss}
            className="mt-2 min-h-[44px] justify-center self-start rounded-lg px-1 py-1 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={t('hub.work.safetyDismiss')}
          >
            <Text style={{ fontFamily: f.medium }} className="text-[14px] text-primary">
              {t('hub.work.safetyDismiss')}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={dismiss}
          hitSlop={8}
          className="p-1"
          accessibilityRole="button"
          accessibilityLabel={t('hub.work.safetyDismiss')}
        >
          <Ionicons name="close" size={22} color={colors.inkMuted} />
        </Pressable>
      </View>
    </View>
  );
}
