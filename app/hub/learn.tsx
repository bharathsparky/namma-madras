import { HubCategoryScreen } from '@/components/HubCategoryScreen';

/** Static route: takes precedence over `hub/[slug]` and guarantees the new Learn hub bundle. */
export default function LearnHubRoute() {
  return <HubCategoryScreen slug="learn" />;
}
