import { toTamilNumerals } from '@/utils/tamilNumerals';

describe('toTamilNumerals', () => {
  it('maps digits to Tamil numerals', () => {
    expect(toTamilNumerals(0, 0)).toBe('௦');
    expect(toTamilNumerals(12, 0)).toBe('௧௨');
  });

  it('respects decimal places', () => {
    expect(toTamilNumerals(3.14, 2)).toBe('௩.௧௪');
  });
});
