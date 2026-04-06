import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
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
  const f = useFontFamily(lang);

  const chip = (id: HomeFoodFilterId, label: string, hint?: string) => {
    const on = selected === id;
    return (
      <Pressable
        key={String(id)}
        onPress={() => onSelect(id)}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        accessibilityHint={hint}
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
  };

  const sortChip = (id: HomeFoodSortId, label: string) => {
    const on = selectedSort === id;
    return (
      <Pressable
        key={id}
        onPress={() => onSelectSort(id)}
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
  };

  const rowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  };

  return (
    <View className="-mx-4 mt-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={filterA11y}
        contentContainerStyle={rowStyle}
      >
        {FILTER_IDS.map((id) => {
          const label = t(`home.quickFilter.${FILTER_I18N_KEY[id]}`);
          const hintKey = id === 'open_now' ? 'home.quickFilter.openNowHint' : null;
          const hint = hintKey ? t(hintKey) : undefined;
          return chip(id, label, hint);
        })}
        <View
          className="mx-0.5 h-[22px] w-px shrink-0 self-center bg-ink/10"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        {SORT_IDS.map((id) => sortChip(id, t(`home.sortBy.${id}`)))}
      </ScrollView>
    </View>
  );
}
