import { router } from 'expo-router';
import { useCallback } from 'react';

/** Stable handler for place detail routes — pairs with memoized `FoodPlaceCard` without stale closures. */
export function useNavigateToPlace() {
  return useCallback((placeId: number) => {
    router.push(`/place/${placeId}` as never);
  }, []);
}
