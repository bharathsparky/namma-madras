import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

/** Tuned for light `surface-dark` — film-grain feel without muddying text (see reference: fine neutral noise). */
const GRAIN_OPACITY = Platform.select({ ios: 0.07, android: 0.065, default: 0.07 });

/**
 * Non-interactive full-bleed noise layer. Sit **behind** content; parent should be `flex:1` with relative positioning.
 */
export function SurfaceGrainOverlay() {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={require('../assets/textures/grain-neutral.png')}
        style={[StyleSheet.absoluteFill, { opacity: GRAIN_OPACITY }]}
        contentFit="cover"
        transition={0}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
