import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type TextProps } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { foodPlaceListRowDivider } from '@/constants/listingCardChrome';
import { colors } from '@/constants/theme';
import { getEmergencyContacts } from '@/db/queries';
import type { EmergencyContactRow, Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn } from '@/utils/pickTaEn';

const LIST_BOTTOM_PAD = 28;
const H_PAD = 20;

type Props = {
  lang: Lang;
  topContent?: ReactNode;
  bottomInset: number;
  marketplaceHeader?: ReactNode;
  /** When true (home tab), render a `View` so `home`’s outer `ScrollView` is the only vertical scroller. */
  nestInParentScroll?: boolean;
};

/**
 * Emergency helplines — flat rows + hairline dividers (aligned with long place lists), not stacked cards.
 */
export function EmergencyContactsFlatList({
  lang,
  topContent,
  bottomInset,
  marketplaceHeader,
  nestInParentScroll = false,
}: Props) {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const f = useFontFamily(lang);
  const contacts = useMemo(() => getEmergencyContacts(db), [db]);

  const subtitlePadding =
    marketplaceHeader && topContent
      ? styles.subtitleMarketplaceAndHero
      : marketplaceHeader
        ? styles.subtitleMarketplaceOnly
        : styles.subtitleDefault;

  const bottomPad = bottomInset + LIST_BOTTOM_PAD;

  const body = (
    <>
      {marketplaceHeader}
      {topContent}

      <View style={[styles.subtitleWrap, subtitlePadding]}>
        <Text style={[styles.subtitle, { fontFamily: f.medium }]}>{t('emergency.subtitle')}</Text>
      </View>

      <View style={styles.listBlock}>
        {contacts.map((row, index) => (
          <EmergencyContactRow
            key={row.id}
            item={row}
            lang={lang}
            f={f}
            isLast={index === contacts.length - 1}
          />
        ))}
      </View>
    </>
  );

  if (nestInParentScroll) {
    return <View style={{ paddingBottom: LIST_BOTTOM_PAD }}>{body}</View>;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      alwaysBounceVertical={false}
    >
      {body}
    </ScrollView>
  );
}

function EmergencyContactRow({
  item,
  lang,
  f,
  isLast,
}: {
  item: EmergencyContactRow;
  lang: Lang;
  f: ReturnType<typeof useFontFamily>;
  isLast: boolean;
}) {
  const label = pickTaEn(lang, item.label_ta, item.label_en);
  const tel = item.phone.replace(/\D/g, '');
  const a11y = `${label}. ${item.phone}`;

  return (
    <View
      className="bg-surface-dark"
      style={[foodPlaceListRowDivider, isLast ? styles.rowLast : null]}
    >
      <Pressable
        onPress={() => void Linking.openURL(`tel:${tel}`)}
        accessibilityRole="button"
        accessibilityLabel={a11y}
        className="min-h-[52px] flex-row items-center gap-3 py-3.5 active:bg-ink/[0.04]"
      >
        <View className="min-w-0 flex-1">
          <Text
            style={{ fontFamily: f.bold }}
            className="text-[16px] leading-[22px] tracking-[-0.2px] text-ink"
            numberOfLines={3}
            ellipsizeMode="tail"
            {...(Platform.OS === 'android' ? { textBreakStrategy: 'simple' as const } : {})}
          >
            {label}
          </Text>
          <View className="mt-1.5 flex-row items-center gap-2">
            <Text
              style={[styles.phone, { fontFamily: f.bold }]}
              className="min-w-0 flex-1 text-[18px] leading-[24px]"
              numberOfLines={1}
              {...(Platform.OS === 'ios'
                ? ({ adjustsFontSizeToFit: true, minimumFontScale: 0.85 } satisfies Partial<TextProps>)
                : {})}
              selectable={false}
            >
              {item.phone}
            </Text>
            <View
              className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emergency/10"
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Ionicons name="call" size={20} color={colors.emergency} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  subtitleWrap: {
    paddingHorizontal: H_PAD,
  },
  subtitleDefault: {
    paddingTop: 16,
    paddingBottom: 14,
  },
  subtitleMarketplaceOnly: {
    paddingTop: 24,
    paddingBottom: 14,
  },
  subtitleMarketplaceAndHero: {
    paddingTop: 20,
    paddingBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkMuted,
  },
  listBlock: {
    paddingHorizontal: H_PAD,
    paddingTop: 2,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  phone: {
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
    color: colors.emergency,
  },
});
