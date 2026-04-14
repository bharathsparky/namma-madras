import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { TRUST_NOTICE_DISMISSED_KEY } from '@/constants/trustNotice';

const SHOW_DELAY_MS = 420;

/**
 * Trust notice on Home: blocking modal until the user acknowledges once (persisted).
 */
export function useIndependentAppTrustNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const dismissed = await AsyncStorage.getItem(TRUST_NOTICE_DISMISSED_KEY);
        if (cancelled || dismissed === '1') return;
        timer = setTimeout(() => {
          if (!cancelled) setVisible(true);
        }, SHOW_DELAY_MS);
      } catch {
        if (!cancelled) {
          timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const acknowledge = useCallback(async () => {
    try {
      await AsyncStorage.setItem(TRUST_NOTICE_DISMISSED_KEY, '1');
    } catch {
      /* still hide */
    }
    setVisible(false);
  }, []);

  return { visible, acknowledge };
}
