import { Linking, Platform } from 'react-native';

/** Chennai centre when device location is unavailable (app is Chennai-focused). */
const DEFAULT_LAT = 13.0827;
const DEFAULT_LON = 80.2707;

/** Opens system Maps with a search biased to the user’s coordinates (or Chennai). */
export async function openMapsSearchNearby(
  query: string,
  latitude?: number | null,
  longitude?: number | null,
): Promise<void> {
  const lat = latitude != null ? latitude : DEFAULT_LAT;
  const lon = longitude != null ? longitude : DEFAULT_LON;
  const latS = lat.toFixed(5);
  const lonS = lon.toFixed(5);
  const q = encodeURIComponent(query);
  const google = `https://www.google.com/maps/search/${q}/@${latS},${lonS},14z`;
  const apple = `https://maps.apple.com/?q=${q}&ll=${latS},${lonS}`;
  const primary = Platform.OS === 'ios' ? apple : google;
  const fallback = `https://www.google.com/maps/search/?api=1&query=${q}`;
  try {
    await Linking.openURL(primary);
  } catch {
    try {
      await Linking.openURL(fallback);
    } catch {
      /* maps unavailable */
    }
  }
}

/** Reception / kalyana mandapam search — opens in Apple or Google Maps. */
export async function openMapsSearchReceptionHallsNearby(
  latitude?: number | null,
  longitude?: number | null,
): Promise<void> {
  await openMapsSearchNearby('reception hall marriage hall', latitude, longitude);
}

/** Opens Apple / Google Maps directions to a coordinate (in-app handoff). */
export async function openDirectionsToPlace(latitude: number, longitude: number): Promise<void> {
  const lat = latitude.toFixed(6);
  const lon = longitude.toFixed(6);
  const apple = `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  const fallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  const primary = Platform.OS === 'ios' ? apple : google;
  try {
    await Linking.openURL(primary);
  } catch {
    try {
      await Linking.openURL(fallback);
    } catch {
      /* maps unavailable */
    }
  }
}
