import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { HubFilterPill } from '@/components/HubFilterPill';
import { HUB_FILTER_SCROLL_CONTENT_STYLE } from '@/constants/listToolbar';
import type { Lang } from '@/db/types';

export type LearnHubFilterId =
  | 'all'
  | 'library'
  | 'study_space'
  | 'exam_coaching'
  | 'skill_training'
  | 'digital_access';

const ORDER: LearnHubFilterId[] = [
  'all',
  'library',
  'study_space',
  'exam_coaching',
  'skill_training',
  'digital_access',
];

const I18N: Record<LearnHubFilterId, string> = {
  all: 'filterAll',
  library: 'filterLibrary',
  study_space: 'filterStudySpace',
  exam_coaching: 'filterExamCoaching',
  skill_training: 'filterSkillTraining',
  digital_access: 'filterDigitalAccess',
};

type Props = {
  lang: Lang;
  selected: LearnHubFilterId;
  onSelect: (id: LearnHubFilterId) => void;
};

export function LearnHubFilterBar({ lang, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const ns = 'hub.learn';

  return (
    <View className="mb-3 w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={HUB_FILTER_SCROLL_CONTENT_STYLE}
        accessibilityRole="scrollbar"
        accessibilityLabel={t('hub.learn.filterBarA11y')}
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
