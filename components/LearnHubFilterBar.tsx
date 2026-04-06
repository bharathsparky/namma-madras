import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

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
  const f = useFontFamily(lang);
  const ns = 'hub.learn';

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
        accessibilityLabel={t('hub.learn.filterBarA11y')}
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
