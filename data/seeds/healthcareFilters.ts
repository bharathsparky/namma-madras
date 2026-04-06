import type { HealthcareCategory } from '@/data/seeds/healthcare';

/** Hub filter chips — maps seed `HealthcareCategory` → stable `places.sub_category` group. */
export type HealthcareFilterSlug =
  | 'health_hospital'
  | 'health_scheme'
  | 'health_mental'
  | 'health_blood'
  | 'health_ambulance'
  | 'health_dental';

export function healthSubCategoryFromHealthcareCategory(cat: HealthcareCategory): HealthcareFilterSlug {
  switch (cat) {
    case 'govt_hospital':
    case 'esi_hospital':
    case 'women_children':
    case 'ngo_clinic':
      return 'health_hospital';
    case 'scheme':
    case 'medicine':
      return 'health_scheme';
    case 'mental_health':
      return 'health_mental';
    case 'blood_bank':
      return 'health_blood';
    case 'ambulance':
      return 'health_ambulance';
    case 'dental':
      return 'health_dental';
    default:
      return 'health_hospital';
  }
}
