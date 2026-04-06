import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** True when device has network connectivity (best-effort). */
export function useNetworkStatus(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sub = NetInfo.addEventListener((s) => {
      setOnline(s.isConnected === true && s.isInternetReachable !== false);
    });
    return () => sub();
  }, []);
  return online;
}
