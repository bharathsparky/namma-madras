const MAP: Record<string, string> = {
  '0': '௦',
  '1': '௧',
  '2': '௨',
  '3': '௩',
  '4': '௪',
  '5': '௫',
  '6': '௬',
  '7': '௭',
  '8': '௮',
  '9': '௯',
  '.': '.',
};

export function toTamilNumerals(num: number, decimals = 1): string {
  const s = num.toFixed(decimals);
  return s
    .split('')
    .map((c) => MAP[c] ?? c)
    .join('');
}
