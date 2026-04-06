import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HealthcareSosRow, Lang } from '@/db/types';
import { elevationRaised } from '@/constants/elevation';
import { colors, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn } from '@/utils/pickTaEn';

const ACCENT = colors.emergency;
const HEADER_WASH = ui.emergencyGradientTop;

type Props = {
  lang: Lang;
  rows: HealthcareSosRow[];
};

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 0 ? `tel:${digits}` : `tel:${phone}`;
}

/**
 * Medical hub — emergency & helpline strip (SQLite `healthcare_sos_numbers`).
 * Phone-first chips, strong emergency anchor, no decorative glass/neon.
 */
export function HealthcareSosCard({ lang, rows }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);

  if (rows.length === 0) return null;

  return (
    <View style={[styles.card, elevationRaised]}>
      <View style={styles.leftStripe} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />

      <LinearGradient colors={HEADER_WASH} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.headerWash} />

      <View className="px-4 pb-3 pt-3.5">
        <View className="flex-row items-start gap-3">
          <View
            style={styles.iconBadge}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Ionicons name="call" size={22} color={ACCENT} />
          </View>
          <View className="min-w-0 flex-1">
            <View className="mb-1.5 flex-row flex-wrap items-center gap-2">
              <View style={styles.sosPill}>
                <Text style={{ fontFamily: f.bold }} className="text-[11px] uppercase tracking-[0.6px] text-emergency">
                  SOS
                </Text>
              </View>
              <Text
                style={{ fontFamily: f.bold }}
                className="text-[18px] leading-[24px] tracking-[-0.3px] text-ink"
                numberOfLines={2}
              >
                {t('hub.medical.sosTitle')}
              </Text>
            </View>
            <Text style={{ fontFamily: f.regular }} className="text-[13px] leading-[19px] text-ink-muted">
              {t('hub.medical.sosSubtitle')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {rows.map((r) => {
            const label = pickTaEn(lang, r.label_ta, r.label_en);
            return (
              <Pressable
                key={r.id}
                onPress={() => void Linking.openURL(telHref(r.phone))}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                accessibilityRole="button"
                accessibilityLabel={`${label}. ${r.phone}`}
                accessibilityHint={t('hub.medical.sosTapHint')}
              >
                <Text
                  style={[styles.chipNumber, { fontFamily: f.bold }]}
                  numberOfLines={1}
                  selectable={false}
                >
                  {r.phone}
                </Text>
                <Text
                  style={{ fontFamily: f.medium }}
                  className="mt-1 text-center text-[11px] leading-[15px] text-ink-muted"
                  numberOfLines={3}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceCardDark,
    borderWidth: 1,
    borderColor: ui.emergencyBorder14,
    overflow: 'hidden',
  },
  leftStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: ACCENT,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 72,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ui.emergencyWash10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.emergencyBorder20,
  },
  sosPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: ui.emergencyWash10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.emergencyBorder18,
  },
  divider: {
    marginTop: 14,
    marginBottom: 12,
    marginLeft: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: ui.dividerSubtle,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    paddingBottom: 4,
    paddingRight: 2,
  },
  chip: {
    minHeight: 88,
    minWidth: 120,
    maxWidth: 168,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceInset,
    borderWidth: 1,
    borderColor: ui.medicalChipBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipNumber: {
    fontSize: 17,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
    color: ACCENT,
    textAlign: 'center',
  },
});
