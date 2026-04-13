import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import type { Lang } from '@/db/types';

export type HygieneHubFilterId =
  | 'all'
  | 'hygiene_toilet'
  | 'hygiene_bath'
  | 'hygiene_clothes'
  | 'hygiene_barber'
  | 'hygiene_sanitary';

const ORDER: HygieneHubFilterId[] = [
  'all',
  'hygiene_bath',
  'hygiene_toilet',
  'hygiene_clothes',
  'hygiene_barber',
  'hygiene_sanitary',
];

/** i18n keys under `listCopyNs` (e.g. hub.hygiene) */
const LABEL_KEY: Record<HygieneHubFilterId, string> = {
  all: 'filterAll',
  hygiene_toilet: 'sectionToilets',
  hygiene_bath: 'sectionBathing',
  hygiene_clothes: 'sectionClothes',
  hygiene_barber: 'sectionHaircut',
  hygiene_sanitary: 'sectionSanitary',
};

type Props = {
  lang: Lang;
  selected: HygieneHubFilterId;
  onSelect: (id: HygieneHubFilterId) => void;
  listCopyNs: string;
};

export function HygieneHubFilterBar({ lang, selected, onSelect, listCopyNs }: Props) {
  const { t } = useTranslation();
  const k = (key: string) => `${listCopyNs}.${key}`;

  return (
    <View className="w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
        accessibilityRole="scrollbar"
        accessibilityLabel={t(k('filterBarA11y'))}
      >
        {ORDER.map((id) => (
          <HubFilterPill
            key={id}
            lang={lang}
            selected={selected === id}
            label={t(k(LABEL_KEY[id]))}
            onPress={() => onSelect(id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
