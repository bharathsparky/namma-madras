import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  WORK_LABOUR_FILTER_ORDER,
  type WorkLabourFilterId,
} from '@/utils/workLabourFilters';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

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
  const f = useFontFamily(lang);
  const ns = 'hub.work';

  return (
    <View className="-mx-4 mb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
        accessibilityRole="scrollbar"
        accessibilityLabel={t(`${ns}.labourFilterBarA11y`)}
      >
        {WORK_LABOUR_FILTER_ORDER.map((id) => {
          const on = selected === id;
          const label =
            id === 'all' ? t(`${ns}.${LABEL_KEY.all}`) : t(`${ns}.${LABEL_KEY[id]}`);
          return (
            <Pressable
              key={id}
              onPress={() => onSelect(id)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              className={`shrink-0 rounded-full border px-3.5 py-2.5 active:opacity-90 ${
                on ? 'border-primary bg-primary/12' : 'border-ink/12 bg-surface-inset/90'
              }`}
            >
              <Text
                style={{ fontFamily: f.medium }}
                className={`text-[13px] leading-[18px] ${on ? 'text-primary' : 'text-ink'}`}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
