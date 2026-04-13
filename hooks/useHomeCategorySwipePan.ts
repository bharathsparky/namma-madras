import { useMemo, useCallback } from 'react';
import { PanResponder } from 'react-native';

const DX_ACTIVATE = 14;
const DX_DOMINANCE = 1.55;
/** Minimum horizontal travel on release to count as a swipe */
const DX_COMMIT = 52;

/**
 * Horizontal swipe on the hub list area: swipe left → next category, swipe right → previous
 * (same direction as swiping between tabs / “pulling” the next screen in).
 * Uses capture so vertical list scrolling still works when the gesture is mostly vertical.
 */
export function useHomeCategorySwipePan(
  orderedSlugs: readonly string[],
  activeSlug: string,
  onSelectSlug: (slug: string) => void,
) {
  const navigate = useCallback(
    (delta: number) => {
      if (orderedSlugs.length === 0) return;
      const i = orderedSlugs.indexOf(activeSlug);
      const from = i >= 0 ? i : 0;
      const next = (from + delta + orderedSlugs.length) % orderedSlugs.length;
      const slug = orderedSlugs[next];
      if (slug !== activeSlug) onSelectSlug(slug);
    },
    [orderedSlugs, activeSlug, onSelectSlug],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_e, g) =>
          Math.abs(g.dx) > DX_ACTIVATE && Math.abs(g.dx) > Math.abs(g.dy) * DX_DOMINANCE,
        onPanResponderRelease: (_e, g) => {
          if (g.dx >= DX_COMMIT) navigate(-1);
          else if (g.dx <= -DX_COMMIT) navigate(1);
        },
      }),
    [navigate],
  );

  return panResponder.panHandlers;
}
