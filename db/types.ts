export type Lang = 'ta' | 'en' | 'hi';

export type CostType = 'free' | 'subsidised' | 'paid';
export type Frequency = 'daily' | 'weekly' | 'periodic' | 'on_call';
export type GenderAccess = 'all' | 'men' | 'women';

export interface CategoryRow {
  id: number;
  slug: string;
  label_en: string;
  label_ta: string;
  icon_name: string;
  color_hex: string;
  sort_order: number;
}

export interface PlaceRow {
  id: number;
  name_en: string;
  name_ta: string;
  category_id: number;
  sub_category: string;
  area: string;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  cost_type: CostType;
  cost_note_en: string | null;
  cost_note_ta: string | null;
  frequency: Frequency;
  serving_days: string | null;
  timing_en: string | null;
  timing_ta: string | null;
  contact_phone: string | null;
  contact_phone2: string | null;
  website: string | null;
  description_en: string | null;
  description_ta: string | null;
  /** Optional HTTPS URL for list / detail cover (offline: falls back to gradient). */
  cover_image_url?: string | null;
  gender_access: GenderAccess;
  capacity_note: string | null;
  documents_required: string | null;
  is_verified: number;
  verified_date: string | null;
  verified_by_org: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  /** 1 when the place offers 24×7 emergency access (healthcare seed). */
  is_emergency_24h?: number;
  /** Healthcare access: `all` | `workers_only` | `women_children` | `income_eligible`. */
  access_type?: string | null;
  /** Learn hub: 1 = AC available (from seed facilities). */
  has_ac?: number;
  /** Learn hub: 1 = Wi‑Fi (from seed facilities). */
  has_wifi?: number;
  /** Stay hub: `gcc_shelter` | `hospital_shelter` | `railway` | … */
  stay_kind?: string | null;
  /** Raw gender from stay seed (men, girls, transgender, …). */
  stay_gender_raw?: string | null;
  requires_valid_ticket?: number;
  includes_food?: number;
  /** 1 = hospital attendant shelter only. */
  hospital_guest_only?: number;
  ngo_name?: string | null;
}

export interface HealthcareSosRow {
  id: number;
  label_en: string;
  label_ta: string;
  phone: string;
  sort_order: number;
}

export interface EmergencyContactRow {
  id: number;
  label_en: string;
  label_ta: string;
  phone: string;
  is_toll_free: number;
  category: string | null;
  sort_order: number;
}

export type Persona = 'crisis' | 'migrant' | 'student' | 'jobseeker' | 'helper' | '';
