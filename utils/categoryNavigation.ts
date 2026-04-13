/**
 * Route targets for category slugs — shared by home quick grid and categories screen.
 */
export function categoryHref(slug: string): string {
  if (slug === 'emergency') return '/emergency';
  if (slug === 'food') return '/home';
  if (slug === 'stay') return '/hub/stay';
  if (slug === 'medical') return '/hub/medical';
  if (slug === 'learn') return '/hub/learn';
  if (slug === 'work') return '/hub/work';
  if (slug === 'hygiene') return '/hub/hygiene';
  return `/category/${slug}`;
}
