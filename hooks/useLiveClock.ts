import { useEffect, useState } from 'react';

/** Updates periodically so time-of-day context (meals, copy) stays correct on long sessions. */
export function useLiveClock(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
