import type { PlaceRow } from '@/db/types';

export type StayGenderFilterId =
  | 'all'
  | 'men'
  | 'women'
  | 'children'
  | 'transgender'
  | 'elderly';

/** Category chips: All + 5 user-named types + choultry/math (seed data). */
export type StayCategoryFilterId =
  | 'all'
  | 'gcc_shelter'
  | 'hospital_shelter'
  | 'gurudwara'
  | 'railway'
  | 'budget_lodge'
  | 'math_choultry';

export function matchesStayGenderFilter(
  stayGenderRaw: string | null | undefined,
  tab: StayGenderFilterId,
): boolean {
  if (tab === 'all') return true;
  if (!stayGenderRaw) return false;
  if (tab === 'men') {
    return ['men', 'boys', 'psychosocial_men', 'developmental_disability_men'].includes(
      stayGenderRaw,
    );
  }
  if (tab === 'women') {
    return ['women', 'girls', 'psychosocial_women', 'disability_women'].includes(stayGenderRaw);
  }
  if (tab === 'children') {
    return ['boys', 'girls'].includes(stayGenderRaw);
  }
  if (tab === 'transgender') return stayGenderRaw === 'transgender';
  if (tab === 'elderly') return stayGenderRaw === 'elderly_mixed';
  return true;
}

export function matchesStayCategoryFilter(
  stayKind: string | null | undefined,
  tab: StayCategoryFilterId,
): boolean {
  if (tab === 'all') return true;
  if (!stayKind) return false;
  return stayKind === tab;
}

export function filterStayPlaces(
  rows: PlaceRow[],
  gender: StayGenderFilterId,
  category: StayCategoryFilterId,
): PlaceRow[] {
  return rows.filter(
    (p) =>
      matchesStayGenderFilter(p.stay_gender_raw, gender) &&
      matchesStayCategoryFilter(p.stay_kind, category),
  );
}

/** Hub quick filters: one pill = one preset (matches Medical/Learn single-row pattern). */
export type StayQuickFilterId =
  | 'all'
  | 'gcc_shelter'
  | 'women'
  | 'men'
  | 'hospital_shelter'
  | 'railway';

export function stayQuickFilterToPair(
  id: StayQuickFilterId,
): { gender: StayGenderFilterId; category: StayCategoryFilterId } {
  switch (id) {
    case 'all':
      return { gender: 'all', category: 'all' };
    case 'gcc_shelter':
      return { gender: 'all', category: 'gcc_shelter' };
    case 'women':
      return { gender: 'women', category: 'all' };
    case 'men':
      return { gender: 'men', category: 'all' };
    case 'hospital_shelter':
      return { gender: 'all', category: 'hospital_shelter' };
    case 'railway':
      return { gender: 'all', category: 'railway' };
  }
}
