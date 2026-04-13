import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import type { Lang } from '@/db/types';
import { CategoryHubBody } from '@/components/CategoryHubBody';
import { CategoryPlacesHubBody } from '@/components/CategoryPlacesHubBody';
import { EmergencyContactsFlatList } from '@/components/EmergencyContactsFlatList';
import { HygieneHubBody } from '@/components/HygieneHubBody';
import { LearnHubBody } from '@/components/LearnHubBody';
import { StayHubBody } from '@/components/StayHubBody';
import { WorkHubBody } from '@/components/WorkHubBody';
import { getCategoryBySlug } from '@/db/queries';

type Props = {
  slug: string;
  lang: Lang;
  bottomInset: number;
  /**
   * Home: hub body is laid out inside `home`’s outer `ScrollView` (sticky category strip).
   * Hygiene / emergency lists use `scrollEnabled={false}` so one scroll drives the screen.
   */
  nestInParentScroll?: boolean;
};

/**
 * Renders the same hub bodies as `/hub/[slug]` — driven by home category chips (no stack navigation).
 */
export function HomeHubSwitcher({ slug, lang, bottomInset, nestInParentScroll = false }: Props) {
  const db = useSQLiteContext();
  const category = useMemo(() => getCategoryBySlug(db, slug), [db, slug]);

  if (!category) {
    return null;
  }

  switch (slug) {
    case 'food':
      return <CategoryHubBody categoryId={category.id} lang={lang} listCopyNs="home" />;
    case 'stay':
      return <StayHubBody lang={lang} listCopyNs="hub.stay" />;
    case 'medical':
      return <CategoryPlacesHubBody categoryId={category.id} lang={lang} listCopyNs="hub.medical" />;
    case 'learn':
      return <LearnHubBody lang={lang} listCopyNs="hub.learn" />;
    case 'work':
      return <WorkHubBody lang={lang} listCopyNs="hub.work" />;
    case 'hygiene':
      return (
        <HygieneHubBody
          categoryId={category.id}
          lang={lang}
          listCopyNs="hub.hygiene"
          hero={null}
          nestInParentScroll={nestInParentScroll}
        />
      );
    case 'emergency':
      return (
        <EmergencyContactsFlatList
          lang={lang}
          bottomInset={bottomInset}
          nestInParentScroll={nestInParentScroll}
        />
      );
    default:
      return <CategoryHubBody categoryId={category.id} lang={lang} listCopyNs={`hub.${slug}`} />;
  }
}
