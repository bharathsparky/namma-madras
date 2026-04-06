import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

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
  const f = useFontFamily(lang);
  const k = (key: string) => `${listCopyNs}.${key}`;

  return (
    <View className="mb-3 w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 20,
          paddingVertical: 4,
        }}
        accessibilityRole="scrollbar"
        accessibilityLabel={t(k('filterBarA11y'))}
      >
        {ORDER.map((id) => {
          const on = selected === id;
          const label = t(k(LABEL_KEY[id]));
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
