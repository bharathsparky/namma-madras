import { Redirect } from 'expo-router';

/** Legacy route — onboarding lives at `/onboard`. */
export default function LegacyOnboardingLanguage() {
  return <Redirect href="/onboard" />;
}
