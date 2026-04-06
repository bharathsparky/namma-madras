import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { HealthcareFilterSlug } from '@/data/seeds/healthcareFilters';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

export type MedicalHubFilterId = 'all' | HealthcareFilterSlug;

const ORDER: MedicalHubFilterId[] = [
  'all',
  'health_hospital',
  'health_scheme',
  'health_mental',
  'health_blood',
  'health_ambulance',
  'health_dental',
];

const I18N: Record<MedicalHubFilterId, string> = {
  all: 'filterAll',
  health_hospital: 'filterHospitals',
  health_scheme: 'filterSchemes',
  health_mental: 'filterMental',
  health_blood: 'filterBlood',
  health_ambulance: 'filterAmbulance',
  health_dental: 'filterDental',
};

type Props = {
  lang: Lang;
  selected: MedicalHubFilterId;
  onSelect: (id: MedicalHubFilterId) => void;
};

export function MedicalHubFilterBar({ lang, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const ns = 'hub.medical';

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
        accessibilityLabel={t('hub.medical.filterBarA11y')}
      >
        {ORDER.map((id) => {
          const on = selected === id;
          const label = t(`${ns}.${I18N[id]}`);
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
