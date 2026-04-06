import { useLocalSearchParams } from 'expo-router';
import { HubCategoryScreen } from '@/components/HubCategoryScreen';
import { normalizeRouteSlugParam } from '@/utils/routeSlug';

export default function HubSlugScreen() {
  const { slug: slugParam } = useLocalSearchParams<{ slug: string | string[] }>();
  const slug = normalizeRouteSlugParam(slugParam);
  return <HubCategoryScreen slug={slug} />;
}
