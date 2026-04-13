import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import type { Lang } from '@/db/types';
import type { HomeFoodSortId } from '@/utils/foodPlaceSort';

export type StayCostFilterId = 'all' | 'free' | 'charged';

const COST_IDS: StayCostFilterId[] = ['all', 'free', 'charged'];
const SORT_IDS: HomeFoodSortId[] = ['nearest', 'name'];

const COST_I18N_KEY: Record<StayCostFilterId, string> = {
  all: 'quickFilterAll',
  free: 'filterCostFree',
  charged: 'filterCostCharged',
};

type Props = {
  lang: Lang;
  selectedCost: StayCostFilterId;
  onSelectCost: (id: StayCostFilterId) => void;
  selectedSort: HomeFoodSortId;
  onSelectSort: (id: HomeFoodSortId) => void;
};

/**
 * Stay hub: cost (free vs fee) and sort — horizontal scroll for overflow.
 */
export function StayHubFilterBar({
  lang,
  selectedCost,
  onSelectCost,
  selectedSort,
  onSelectSort,
}: Props) {
  const { t } = useTranslation();
  const barA11y = t('hub.stay.filterSortBarA11y');

  return (
    <View className="mt-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={barA11y}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
      >
        {COST_IDS.map((id) => (
          <HubFilterPill
            key={id}
            lang={lang}
            selected={selectedCost === id}
            label={t(`hub.stay.${COST_I18N_KEY[id]}`)}
            onPress={() => onSelectCost(id)}
          />
        ))}
        <View
          className="mx-0.5 h-[26px] w-px shrink-0 self-center bg-ink/[0.08]"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        {SORT_IDS.map((id) => (
          <HubFilterPill
            key={id}
            lang={lang}
            selected={selectedSort === id}
            label={t(`home.sortBy.${id}`)}
            onPress={() => onSelectSort(id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
