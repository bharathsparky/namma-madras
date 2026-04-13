import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import type { Lang } from '@/db/types';
import type { HomeFoodSortId } from '@/utils/foodPlaceSort';

/** List scope: everything we list is already free or low-cost — only time (“open now”) is worth filtering. */
export type HomeFoodFilterId = 'all' | 'open_now';

const FILTER_IDS: HomeFoodFilterId[] = ['all', 'open_now'];

const FILTER_I18N_KEY: Record<HomeFoodFilterId, string> = {
  all: 'all',
  open_now: 'openNow',
};
const SORT_IDS: HomeFoodSortId[] = ['nearest', 'smart', 'meal_window', 'name'];

type Props = {
  lang: Lang;
  selected: HomeFoodFilterId;
  onSelect: (id: HomeFoodFilterId) => void;
  selectedSort: HomeFoodSortId;
  onSelectSort: (id: HomeFoodSortId) => void;
  /** Screen reader label for the filter row (defaults to food home copy). */
  filterBarA11yLabel?: string;
};

/**
 * Single horizontal strip: quick filter (open vs all) and sort — scroll for overflow.
 */
export function HomeFoodFilterBar({
  lang,
  selected,
  onSelect,
  selectedSort,
  onSelectSort,
  filterBarA11yLabel,
}: Props) {
  const { t } = useTranslation();
  const filterA11y = filterBarA11yLabel ?? t('home.filterSortBarA11y');

  return (
    <View className="mt-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={filterA11y}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
      >
        {FILTER_IDS.map((id) => {
          const label = t(`home.quickFilter.${FILTER_I18N_KEY[id]}`);
          const hintKey = id === 'open_now' ? 'home.quickFilter.openNowHint' : null;
          const hint = hintKey ? t(hintKey) : undefined;
          const on = selected === id;
          return (
            <HubFilterPill
              key={String(id)}
              lang={lang}
              selected={on}
              label={label}
              onPress={() => onSelect(id)}
              accessibilityHint={hint}
            />
          );
        })}
        <View
          className="mx-0.5 h-[26px] w-px shrink-0 self-center bg-ink/[0.08]"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        {SORT_IDS.map((id) => {
          const on = selectedSort === id;
          return (
            <HubFilterPill
              key={id}
              lang={lang}
              selected={on}
              label={t(`home.sortBy.${id}`)}
              onPress={() => onSelectSort(id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
