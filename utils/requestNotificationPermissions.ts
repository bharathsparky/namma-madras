import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Remote push APIs were removed from Expo Go in SDK 53. Importing `expo-notifications`
 * still initializes native code and surfaces a console error there — so we skip loading
 * the module entirely in the store client (Expo Go). Use a dev build for full testing.
 *
 * @see https://docs.expo.dev/develop/development-builds/introduction/
 */
export async function requestNotificationPermissionsIfSupported(): Promise<void> {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return;
  }
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.requestPermissionsAsync();
  } catch {
    /* optional */
  }
}
