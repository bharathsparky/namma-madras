import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { onboarding, ui } from '@/constants/theme';

const TOTAL = 3;

/** Step 1–3 dots — minimal wayfinding; exposed to assistive tech as progress. */
export function OnboardingProgress({ step, total = TOTAL }: { step: number; total?: number }) {
  const { t } = useTranslation();

  return (
    <View
      className="mb-8 flex-row justify-center gap-2"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('a11y.onboardingStep', { current: step, total })}
      accessibilityValue={{ min: 1, max: total, now: step, text: `${step} of ${total}` }}
    >
      {Array.from({ length: total }, (_, i) => {
        const s = i + 1;
        const isDone = s < step;
        const isCurrent = s === step;
        return (
          <View
            key={i}
            className="h-1.5 rounded-full"
            importantForAccessibility="no-hide-descendants"
            style={{
              width: isCurrent ? 28 : 8,
              backgroundColor:
                isDone || isCurrent ? onboarding.teal : ui.onboardingTrack,
              opacity: isCurrent ? 1 : isDone ? 0.55 : 1,
            }}
          />
        );
      })}
    </View>
  );
}
