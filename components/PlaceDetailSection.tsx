import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { PLACE_DETAIL } from '@/constants/placeDetailSpacing';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

type Props = {
  lang: Lang;
  /** Short overline — e.g. LOCATION, ABOUT */
  label?: string;
  children: ReactNode;
};

/**
 * Editorial-style section for place detail — rhythm + hierarchy without nested cards.
 */
export function PlaceDetailSection({ lang, label, children }: Props) {
  const f = useFontFamily(lang);
  return (
    <View style={{ marginTop: PLACE_DETAIL.section }}>
      {label ? (
        <Text
          style={{ fontFamily: f.medium, marginBottom: PLACE_DETAIL.sectionLabelBottom }}
          className="text-[11px] uppercase tracking-[0.14em] text-ink-faint"
          accessibilityRole="header"
        >
          {label}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
