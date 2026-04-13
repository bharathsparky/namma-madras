import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { colors } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

type Props = {
  latitude: number;
  longitude: number;
  address: string;
  lang?: Lang;
};

/** OSM static image — no Google Maps SDK / API key required (avoids crashes on release builds). */
function staticMapUri(lat: number, lon: number): string {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=400x280&markers=${lat},${lon},red-pushpin`;
}

function openGoogleMaps(lat: number, lon: number, address: string) {
  void Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
  ).catch(() => {
    void Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    );
  });
}

export function OfflineMapGuard({ latitude, longitude, address, lang = 'en' }: Props) {
  const online = useNetworkStatus();
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

  const openMaps = useCallback(() => {
    openGoogleMaps(latitude, longitude, address);
  }, [latitude, longitude, address]);

  if (!online) {
    return <MapPlaceholder address={address} lang={lang} />;
  }

  if (mapLoadFailed) {
    return (
      <Pressable
        onPress={openMaps}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.directionsToPlace', { place: address })}
        className="min-h-[220px] justify-center overflow-hidden rounded-xl border border-ink/10 bg-surface-inset px-5 py-6 active:opacity-92"
      >
        <View className="items-center">
          <Ionicons name="map-outline" size={40} color={colors.inkMuted} />
          <Text style={{ fontFamily: f.medium }} className="mt-3 text-center text-[15px] leading-[22px] text-ink/88">
            {address}
          </Text>
          <Text style={{ fontFamily: f.bold }} className="mt-4 text-[15px] text-ink">
            {t('common.directions')}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={openMaps}
      accessibilityRole="button"
      accessibilityLabel={t('a11y.directionsToPlace', { place: address })}
      accessibilityHint={t('common.directions')}
      className="h-[220px] overflow-hidden rounded-xl border border-ink/10"
    >
      <Image
        source={{ uri: staticMapUri(latitude, longitude) }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        onError={() => setMapLoadFailed(true)}
      />
    </Pressable>
  );
}
