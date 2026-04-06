import { LinearGradient } from 'expo-linear-gradient';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export type BannerGradientNoiseVariant = 'dark' | 'light' | 'brand';

type Props = {
  variant?: BannerGradientNoiseVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Banner wash: layered linear gradients only (Asphalt dusk / warm canvas / brand green).
 */
export function BannerGradientNoise({ variant = 'dark', style }: Props) {
  const mesh = MESH_BY_VARIANT[variant];
  return (
    <View style={[StyleSheet.absoluteFillObject, style]} pointerEvents="none">
      <LinearGradient
        colors={mesh.primary.colors}
        locations={mesh.primary.locations}
        start={mesh.primary.start}
        end={mesh.primary.end}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={mesh.lift.colors}
        locations={mesh.lift.locations}
        start={mesh.lift.start}
        end={mesh.lift.end}
        style={[StyleSheet.absoluteFillObject, { opacity: mesh.liftOpacity }]}
      />
    </View>
  );
}

const DARK_MESH = {
  primary: {
    colors: [
      'rgba(255, 195, 130, 0.22)',
      'rgba(200, 140, 110, 0.14)',
      'rgba(95, 72, 118, 0.18)',
      'rgba(42, 34, 58, 0.32)',
    ] as const,
    locations: [0, 0.28, 0.62, 1] as const,
    start: { x: 0.08, y: 0 },
    end: { x: 0.92, y: 1 },
  },
  lift: {
    colors: [
      'rgba(240, 160, 75, 0.1)',
      'rgba(255, 255, 255, 0)',
      'rgba(55, 45, 70, 0.08)',
    ] as const,
    locations: [0, 0.45, 1] as const,
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  liftOpacity: 0.55,
} as const;

const LIGHT_MESH = {
  primary: {
    colors: [
      'rgba(255, 250, 242, 0.55)',
      'rgba(245, 248, 255, 0.5)',
      'rgba(228, 240, 252, 0.52)',
    ] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  lift: {
    colors: [
      'rgba(255, 235, 210, 0.2)',
      'rgba(255, 255, 255, 0)',
      'rgba(180, 220, 245, 0.18)',
    ] as const,
    locations: [0, 0.42, 1] as const,
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
  liftOpacity: 0.45,
} as const;

const BRAND_MESH = {
  primary: {
    colors: [
      'rgba(255, 255, 255, 0.16)',
      'rgba(0, 195, 75, 0.2)',
      'rgba(0, 130, 48, 0.38)',
    ] as const,
    locations: [0, 0.42, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  lift: {
    colors: [
      'rgba(255, 240, 120, 0.12)',
      'rgba(255, 255, 255, 0)',
      'rgba(0, 70, 35, 0.25)',
    ] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0.15, y: 0 },
    end: { x: 0.85, y: 1 },
  },
  liftOpacity: 0.5,
} as const;

const MESH_BY_VARIANT = {
  dark: DARK_MESH,
  light: LIGHT_MESH,
  brand: BRAND_MESH,
} as const;
