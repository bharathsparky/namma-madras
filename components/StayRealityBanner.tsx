import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Lang } from '@/db/types';
import { STAY_REALITY_BANNER } from '@/constants/stayHub';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';

const STORAGE_KEY = '@csg/stay_reality_banner_dismissed';

type Props = { lang: Lang };

/** STAY_NOTES.reality_check — dismissible once (session persists). */
export function StayRealityBanner({ lang }: Props) {
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

  return (
    <View
      className="mb-3 rounded-xl px-3.5 py-3"
      style={{
        borderWidth: 1,
        borderColor: STAY_REALITY_BANNER.borderColor,
        backgroundColor: STAY_REALITY_BANNER.background,
      }}
    >
      <View className="flex-row items-start gap-2">
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={STAY_REALITY_BANNER.icon}
          style={{ marginTop: 1 }}
        />
        <View className="min-w-0 flex-1">
          <Text style={{ fontFamily: f.medium }} className="text-[14px] leading-5 text-ink/88">
            {t('hub.stay.realityCheck')}
          </Text>
          <Pressable
            onPress={dismiss}
            className="mt-2 min-h-[44px] justify-center self-start rounded-lg px-1 py-1 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={t('hub.stay.realityDismiss')}
          >
            <Text style={{ fontFamily: f.medium }} className="text-[14px] text-primary">
              {t('hub.stay.realityDismiss')}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={dismiss}
          hitSlop={8}
          className="p-1"
          accessibilityRole="button"
          accessibilityLabel={t('hub.stay.realityDismiss')}
        >
          <Ionicons name="close" size={22} color={colors.inkMuted} />
        </Pressable>
      </View>
    </View>
  );
}
