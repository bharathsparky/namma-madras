import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import {
  WORK_LABOUR_FILTER_ORDER,
  type WorkLabourFilterId,
} from '@/utils/workLabourFilters';
import type { Lang } from '@/db/types';

const LABEL_KEY: Record<WorkLabourFilterId, string> = {
  all: 'labourFilterAll',
  construction: 'workTypeConstruction',
  loading_unloading: 'workTypeLoading',
  factory_industrial: 'workTypeFactory',
  film_shoots: 'workTypeFilm',
};

type Props = {
  lang: Lang;
  selected: WorkLabourFilterId;
  onSelect: (id: WorkLabourFilterId) => void;
};

/** Horizontal pills — same chrome as Medical / Learn hub filter bars. */
export function WorkLabourFilterBar({ lang, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const ns = 'hub.work';

  return (
    <View className="mb-3 w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
        accessibilityRole="scrollbar"
        accessibilityLabel={t(`${ns}.labourFilterBarA11y`)}
      >
        {WORK_LABOUR_FILTER_ORDER.map((id) => {
          const label =
            id === 'all' ? t(`${ns}.${LABEL_KEY.all}`) : t(`${ns}.${LABEL_KEY[id]}`);
          return (
            <HubFilterPill
              key={id}
              lang={lang}
              selected={selected === id}
              label={label}
              onPress={() => onSelect(id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
