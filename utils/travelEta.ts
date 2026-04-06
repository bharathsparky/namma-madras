/** Rough road ETA for sorting and expectations (urban Chennai, mixed traffic). */
export function travelMinutesFromDistanceKm(distanceKm: number, avgSpeedKmh = 22): number {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 5;
  const mins = (distanceKm / avgSpeedKmh) * 60;
  return Math.max(3, Math.round(mins));
}
