import type { ReactNode } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { colors } from '@/constants/theme';
import { HYGIENE_NOTES } from '@/data/seeds/hygiene';
import { getHubCategoryPlaces } from '@/db/queries';
import type { Lang, PlaceRow } from '@/db/types';
import { useLocationStore } from '@/stores/locationStore';
import { HygieneHubFilterBar, type HygieneHubFilterId } from '@/components/HygieneHubFilterBar';
import { HygienePlaceCard } from '@/components/HygienePlaceCard';
import { HygieneQuickTipCard } from '@/components/HygieneQuickTipCard';
import { SectionHeading } from '@/components/SectionHeading';
import { useFontFamily } from '@/hooks/useFontFamily';
import { pickTaEnHi } from '@/utils/pickTaEn';

const GCC_HELPLINE_TEL = '1913';
const SCROLL_PAD_FAB = 80;

type SectionDef = {
  key: string;
  sub: string;
  titleKey: string;
  tipKey: 'bath' | 'clothes' | 'barber' | null;
  stickyBanner: boolean;
};

/** Bath before toilets — primary need is a place to wash / use facilities; compliance copy stays small under Toilets. */
const SECTION_DEFS: SectionDef[] = [
  { key: 'bath', sub: 'hygiene_bath', titleKey: 'sectionBathing', tipKey: 'bath', stickyBanner: false },
  { key: 'toilet', sub: 'hygiene_toilet', titleKey: 'sectionToilets', tipKey: null, stickyBanner: true },
  { key: 'clothes', sub: 'hygiene_clothes', titleKey: 'sectionClothes', tipKey: 'clothes', stickyBanner: false },
  { key: 'barber', sub: 'hygiene_barber', titleKey: 'sectionHaircut', tipKey: 'barber', stickyBanner: false },
  { key: 'sanitary', sub: 'hygiene_sanitary', titleKey: 'sectionSanitary', tipKey: null, stickyBanner: false },
];

type HygieneSection = SectionDef & { data: PlaceRow[]; sectionIndex: number };

type Props = {
  categoryId: number;
  lang: Lang;
  listCopyNs: string;
  hero: ReactNode;
};

export function HygieneHubBody({ categoryId, lang, listCopyNs, hero }: Props) {
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

  const listHeader = (
    <View>
      {hero}
      {places.length > 0 ? (
        <HygieneHubFilterBar
          lang={lang}
          selected={hygieneFilter}
          onSelect={setHygieneFilter}
          listCopyNs={listCopyNs}
        />
      ) : null}
    </View>
  );

  const listEmpty =
    sections.length === 0 ? (
      <View className="px-5 pt-2">
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
              <Text style={{ fontFamily: f.medium }} className="text-primary">
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
              <Text style={{ fontFamily: f.medium }} className="text-primary">
                {t(k('quickFilterClear'))}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    ) : null;

  return (
    <SectionList<PlaceRow, HygieneSection>
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + SCROLL_PAD_FAB,
        paddingTop: 0,
      }}
      renderSectionHeader={({ section }) => {
        const isFirst = section.sectionIndex === 0;
        return (
          <View className="bg-surface-dark pb-3">
            <View className={`px-5 ${isFirst ? 'pb-3 pt-2' : 'pb-3 pt-8'}`}>
              <SectionHeading lang={lang} title={t(k(section.titleKey))} className="mb-0" />
            </View>
            {section.stickyBanner ? (
              <View className="px-5 pb-2 pt-1">
                <View className="rounded-xl border border-ink/10 bg-surface-inset/95 px-3 py-2.5">
                  <Text style={{ fontFamily: f.regular }} className="text-[13px] leading-[20px] text-ink/88">
                    {t('hub.hygiene.toiletNoticePrefix')}
                    <Text
                      onPress={() => void Linking.openURL(`tel:${GCC_HELPLINE_TEL}`)}
                      style={{ fontFamily: f.bold, color: colors.primary }}
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
            {section.tipKey ? (
              <View className="px-5 pb-1 pt-3">
                <HygieneQuickTipCard
                  lang={lang}
                  body={tipBody(section.tipKey)}
                  quickTipLabel={t(k('quickTip'))}
                />
              </View>
            ) : null}
          </View>
        );
      }}
      renderItem={({ item, index }) => (
        <View className={`px-5 ${index === 0 ? 'pt-2' : 'pt-0'}`}>
          <HygienePlaceCard place={item} lang={lang} />
        </View>
      )}
    />
  );
}
