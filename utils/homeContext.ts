export type HomeContext = 'morning' | 'midday' | 'afternoon' | 'evening';

/** PRD §5 time bands for Home cards. */
export function getHomeContext(d = new Date()): HomeContext {
  const h = d.getHours();
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 18) return 'afternoon';
  return 'evening';
}
