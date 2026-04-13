import { Redirect } from 'expo-router';

/** Persona step removed — language selection is next after intro. */
export default function LegacyOnboardPersona() {
  return <Redirect href={'/onboard/language' as never} />;
}
