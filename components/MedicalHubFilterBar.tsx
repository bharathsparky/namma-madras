import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import type { HealthcareFilterSlug } from '@/data/seeds/healthcareFilters';
import type { Lang } from '@/db/types';

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
  const ns = 'hub.medical';

  return (
    <View className="mb-3 w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
        accessibilityRole="scrollbar"
        accessibilityLabel={t('hub.medical.filterBarA11y')}
      >
        {ORDER.map((id) => (
          <HubFilterPill
            key={id}
            lang={lang}
            selected={selected === id}
            label={t(`${ns}.${I18N[id]}`)}
            onPress={() => onSelect(id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
