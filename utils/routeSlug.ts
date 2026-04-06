/**
 * Expo Router may pass `slug` as string | string[]; URLs can vary in case.
 * DB slugs and hub keys are lowercase (e.g. `learn`).
 */
export function normalizeRouteSlugParam(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return String(v ?? '')
    .trim()
    .toLowerCase();
}
