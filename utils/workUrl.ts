/** Ensures https for register / external links from seed hostnames. */
export function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const s = raw?.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}
