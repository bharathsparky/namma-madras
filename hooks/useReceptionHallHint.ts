import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ToastAndroid } from 'react-native';
import {
  getReceptionHallHint,
  type ReceptionHallHint,
} from '@/utils/receptionHallContext';

const STORAGE_KEY = '@csg/reception_hall_hint_dismissed_date';

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * One hint per calendar day (until dismissed). Android also shows a short system toast once when shown.
 */
export function useReceptionHallHint() {
  const { t } = useTranslation();
  const [hint, setHint] = useState<ReceptionHallHint | null>(null);
  const toasted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const today = ymd(new Date());
        const dismissed = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (dismissed === today) {
          return;
        }
        const h = getReceptionHallHint(new Date());
        if (h && !cancelled) {
          setHint(h);
        }
      } catch {
        /* storage unavailable — skip hint */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hint || toasted.current) return;
    if (Platform.OS === 'android') {
      ToastAndroid.show(t('home.receptionHall.toastShort'), ToastAndroid.SHORT);
      toasted.current = true;
    }
  }, [hint, t]);

  const dismiss = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, ymd(new Date()));
    setHint(null);
  }, []);

  return { hint, dismiss };
}
