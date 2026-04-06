import type { PressableProps } from 'react-native';

/** UI UX Pro Max / RN guideline: expand tappable area for icon-only controls */
export const HIT_SLOP_COMFORT: NonNullable<PressableProps['hitSlop']> = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

export const HIT_SLOP_WIDE: NonNullable<PressableProps['hitSlop']> = {
  top: 8,
  bottom: 8,
  left: 16,
  right: 16,
};
