import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

/**
 * Frosted veil over “not now” rows — native blur on iOS/Android; web uses a soft scrim.
 */
export function PlaceDeemphasisOverlay() {
  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: 16,
            backgroundColor: 'rgba(243, 244, 246, 0.78)',
          },
        ]}
      />
    );
  }
  return (
    <BlurView
      intensity={28}
      tint="light"
      style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
