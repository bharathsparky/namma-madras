import type { ReactNode } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { colors } from '@/constants/theme';
import { HYGIENE_NOTES } from '@/data/seeds/hygiene';
import { getCategoryById, getHubCategoryPlaces } from '@/db/queries';
import type { Lang, PlaceRow } from '@/db/types';
import { useLocationStore } from '@/stores/locationStore';
import { HygieneHubFilterBar, type HygieneHubFilterId } from '@/components/HygieneHubFilterBar';
import { HygienePlaceCard } from '@/components/HygienePlaceCard';
import { HygieneQuickTipCard } from '@/components/HygieneQuickTipCard';
import { ListSearchButton } from '@/components/ListSearchButton';
import { SectionHeading } from '@/components/SectionHeading';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEn, pickTaEnHi } from '@/utils/pickTaEn';

const GCC_HELPLINE_TEL = '1913';
const SCROLL_PAD_FAB = 80;
/** Sticky headers stay readable while letting global grain show through (matches surface-dark @ ~92%). */
const SECTION_HEADER_BG = 'rgba(250, 248, 245, 0.92)';

type SectionDef = {
  key: string;
  sub: string;
  titleKey: string;
  stickyBanner: boolean;
};

/** Bath before toilets — primary need is a place to wash / use facilities; compliance copy stays under Toilets section only. */
const SECTION_DEFS: SectionDef[] = [
  { key: 'bath', sub: 'hygiene_bath', titleKey: 'sectionBathing', stickyBanner: false },
  { key: 'toilet', sub: 'hygiene_toilet', titleKey: 'sectionToilets', stickyBanner: true },
  { key: 'clothes', sub: 'hygiene_clothes', titleKey: 'sectionClothes', stickyBanner: false },
  { key: 'barber', sub: 'hygiene_barber', titleKey: 'sectionHaircut', stickyBanner: false },
  { key: 'sanitary', sub: 'hygiene_sanitary', titleKey: 'sectionSanitary', stickyBanner: false },
];

function tipKeyForFilter(f: HygieneHubFilterId): 'bath' | 'clothes' | 'barber' | null {
  if (f === 'hygiene_bath') return 'bath';
  if (f === 'hygiene_clothes') return 'clothes';
  if (f === 'hygiene_barber') return 'barber';
  return null;
}

type HygieneSection = SectionDef & { data: PlaceRow[]; sectionIndex: number };

type Props = {
  categoryId: number;
  lang: Lang;
  listCopyNs: string;
  hero: ReactNode;
  /** Home: teal marketplace strip — must scroll with this list (SectionList header). */
  marketplaceHeader?: ReactNode;
  /**
   * When true (home tab), list is embedded in `home`’s outer `ScrollView` so the category strip can stick.
   * SectionList does not scroll itself — avoid nested VirtualizedList inside ScrollView.
   */
  nestInParentScroll?: boolean;
};

export function HygieneHubBody({
  categoryId,
  lang,
  listCopyNs,
  hero,
  marketplaceHeader,
  nestInParentScroll = false,
}: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const db = useSQLiteContext();
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const insets = useSafeAreaInsets();
  const [hygieneFilter, setHygieneFilter] = useState<HygieneHubFilterId>('all');

  const places = useMemo(
    () => getHubCategoryPlaces(db, categoryId, lat, lon) as PlaceRow[],
    [db, categoryId, lat, lon],
  );

  const hygieneCategoryRow = useMemo(() => getCategoryById(db, categoryId), [db, categoryId]);

  const defsForFilter = useMemo(() => {
    if (hygieneFilter === 'all') return SECTION_DEFS;
    return SECTION_DEFS.filter((d) => d.sub === hygieneFilter);
  }, [hygieneFilter]);

  const sections: HygieneSection[] = useMemo(() => {
    const bySub = (sub: string) => places.filter((p) => p.sub_category === sub);
    const withData = defsForFilter.map((def) => ({
      ...def,
      data: bySub(def.sub),
    })).filter((s) => s.data.length > 0);
    return withData.map((s, sectionIndex) => ({ ...s, sectionIndex }));
  }, [places, defsForFilter]);

  const k = (key: string) => `${listCopyNs}.${key}`;

  const tipBody = (tipKey: 'bath' | 'clothes' | 'barber'): string => {
    if (tipKey === 'bath')
      return pickTaEnHi(lang, HYGIENE_NOTES.bath_tip.ta, HYGIENE_NOTES.bath_tip.en, HYGIENE_NOTES.bath_tip.hi);
    if (tipKey === 'clothes')
      return pickTaEnHi(
        lang,
        HYGIENE_NOTES.clothes_tip.ta,
        HYGIENE_NOTES.clothes_tip.en,
        HYGIENE_NOTES.clothes_tip.hi,
      );
    return pickTaEnHi(lang, HYGIENE_NOTES.barber_tip.ta, HYGIENE_NOTES.barber_tip.en, HYGIENE_NOTES.barber_tip.hi);
  };

  const singleFilterTipKey = tipKeyForFilter(hygieneFilter);

  const listHeader = (
    <View>
      {marketplaceHeader}
      {hero}
      {places.length > 0 ? (
        <View className="gap-3 px-4 pb-3 pt-5">
          <SectionHeading
            lang={lang}
            overline={t('home.hygieneListToolbarOverline')}
            title={t('home.hygieneListToolbarTitle')}
            className="mb-0"
            right={
              hygieneCategoryRow ? (
                <ListSearchButton
                  categoryId={categoryId}
                  accessibilityLabel={t('home.listSearchA11yScoped', {
                    category: pickTaEn(lang, hygieneCategoryRow.label_ta, hygieneCategoryRow.label_en),
                  })}
                />
              ) : null
            }
          />
          <HygieneHubFilterBar
            lang={lang}
            selected={hygieneFilter}
            onSelect={setHygieneFilter}
            listCopyNs={listCopyNs}
          />
          {hygieneFilter === 'all' ? (
            <View
              className="rounded-xl border border-ink/12 bg-ink/[0.04] px-3.5 py-3"
              accessibilityRole="text"
              accessibilityLabel={[
                t(k('quickTipsTitle')),
                tipBody('bath'),
                tipBody('clothes'),
                tipBody('barber'),
              ].join('. ')}
            >
              <Text style={{ fontFamily: f.bold }} className="text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                {t(k('quickTipsTitle'))}
              </Text>
              {(['bath', 'clothes', 'barber'] as const).map((tk, i) => (
                <View key={tk} className={i > 0 ? 'mt-3 border-t border-ink/[0.07] pt-3' : 'mt-2'}>
                  <Text style={{ fontFamily: f.bold }} className="text-[13px] leading-5 text-ink">
                    {tk === 'bath'
                      ? t(k('sectionBathing'))
                      : tk === 'clothes'
                        ? t(k('sectionClothes'))
                        : t(k('sectionHaircut'))}
                  </Text>
                  <Text style={{ fontFamily: f.regular }} className="mt-1 text-[14px] leading-[21px] text-ink/90">
                    {tipBody(tk)}
                  </Text>
                </View>
              ))}
            </View>
          ) : singleFilterTipKey ? (
            <HygieneQuickTipCard
              lang={lang}
              body={tipBody(singleFilterTipKey)}
              quickTipLabel={t(k('quickTip'))}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );

  const listPadBottom = nestInParentScroll ? SCROLL_PAD_FAB : insets.bottom + SCROLL_PAD_FAB;

  const listEmpty =
    sections.length === 0 ? (
      <View className="px-4 pt-2">
        {places.length === 0 ? (
          <View className="rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
            <Text style={{ fontFamily: f.regular }} className="text-sm text-ink-muted">
              {t('common.noResults')}
            </Text>
            <Pressable
              onPress={() => router.push('/categories')}
              className="mt-2 min-h-[44px] justify-center"
              accessibilityRole="button"
              accessibilityLabel={t('home.heroBrowseCategories')}
              accessibilityHint={t('a11y.openCategory')}
            >
              <Text style={{ fontFamily: f.medium }} className="text-ink-muted">
                {t('home.heroBrowseCategories')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="rounded-xl border border-ink/10 bg-surface-card-dark px-4 py-3">
            <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
              {t(k('quickFilterEmpty'))}
            </Text>
            <Pressable
              onPress={() => setHygieneFilter('all')}
              className="mt-3 min-h-[44px] justify-center"
              accessibilityRole="button"
              accessibilityLabel={t(k('quickFilterClear'))}
            >
              <Text style={{ fontFamily: f.medium }} className="text-ink-muted">
                {t(k('quickFilterClear'))}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    ) : null;

  return (
    <SectionList<PlaceRow, HygieneSection>
      style={nestInParentScroll ? { backgroundColor: 'transparent' } : { flex: 1, backgroundColor: 'transparent' }}
      scrollEnabled={!nestInParentScroll}
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      stickySectionHeadersEnabled={!nestInParentScroll}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      contentContainerStyle={{
        flexGrow: nestInParentScroll ? 0 : 1,
        paddingBottom: listPadBottom,
        paddingTop: 0,
      }}
      renderSectionHeader={({ section }) => {
        const isFirst = section.sectionIndex === 0;
        return (
          <View
            style={[styles.sectionHeaderShell, { backgroundColor: SECTION_HEADER_BG }]}
            className="pb-3"
          >
            <View className={`px-4 ${isFirst ? 'pb-3 pt-2' : 'pb-3 pt-8'}`}>
              <SectionHeading lang={lang} title={t(k(section.titleKey))} className="mb-0" />
            </View>
            {section.stickyBanner ? (
              <View className="px-4 pb-2 pt-1">
                <View className="rounded-xl border border-ink/10 bg-surface-inset/95 px-3 py-2.5">
                  <Text style={{ fontFamily: f.regular }} className="text-[13px] leading-[20px] text-ink/88">
                    {t('hub.hygiene.toiletNoticePrefix')}
                    <Text
                      onPress={() => void Linking.openURL(`tel:${GCC_HELPLINE_TEL}`)}
                      style={{ fontFamily: f.bold, color: colors.ink }}
                      accessibilityRole="link"
                      accessibilityLabel={t('hub.hygiene.call1913A11y')}
                    >
                      {GCC_HELPLINE_TEL}
                    </Text>
                    {t('hub.hygiene.toiletNoticeSuffix')}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        );
      }}
      renderItem={({ item, index }) => (
        <View className={`px-4 ${index === 0 ? 'pt-2' : 'pt-0'}`}>
          <HygienePlaceCard place={item} lang={lang} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeaderShell: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(31, 28, 26, 0.06)',
  },
});
