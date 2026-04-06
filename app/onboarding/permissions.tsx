import { Redirect } from 'expo-router';

export default function LegacyOnboardingPermissions() {
  return <Redirect href="/onboard/permissions" />;
}
