import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { WorkPlace } from '@/data/seeds/work';
import { listingCardOutline, listingCardShell } from '@/constants/listingCardChrome';
import { colors } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { workDisplayDailyWage, workDisplayName } from '@/utils/seedLocale';
import { normalizeWebsiteUrl } from '@/utils/workUrl';
import { WorkPlaceBadges } from '@/components/WorkPlaceBadges';

type Props = {
  place: WorkPlace;
  lang: Lang;
};

export function WorkWelfareSchemeCard({ place, lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const name = workDisplayName(place, lang, t);
  const benefit = workDisplayDailyWage(place, lang, t);
  const areaLine = lang === 'ta' ? place.full_address : place.full_address;
  const url = normalizeWebsiteUrl(place.website);
  const tel = place.phone?.replace(/\D/g, '');

  const onRegister = () => {
    if (url) void Linking.openURL(url);
  };

  const onCall = () => {
    if (tel) void Linking.openURL(`tel:${tel}`);
  };

  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl bg-surface-card-dark"
      style={listingCardShell(listingCardOutline.work)}
    >
      <View className="px-4 py-4">
        <Text
          style={{ fontFamily: f.bold }}
          className="text-[18px] leading-6 tracking-[-0.25px] text-ink"
          numberOfLines={3}
        >
          {name}
        </Text>
        <Text style={{ fontFamily: f.regular }} className="mt-1 text-[13px] leading-5 text-ink-muted" numberOfLines={2}>
          {place.area}
        </Text>

        <WorkPlaceBadges lang={lang} isGovt={place.is_govt} />

        <View className="mt-2 rounded-xl border border-ink/12 bg-ink/[0.04] px-3 py-2.5">
          <Text style={{ fontFamily: f.medium }} className="text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            {t('hub.work.keyBenefit')}
          </Text>
          <Text style={{ fontFamily: f.regular }} className="mt-1.5 text-[14px] leading-5 text-ink/92">
            {benefit}
          </Text>
        </View>

        {areaLine.length > 0 ? (
          <Text style={{ fontFamily: f.regular }} className="mt-2 text-[12px] leading-[18px] text-ink-muted" numberOfLines={4}>
            {areaLine}
          </Text>
        ) : null}

        {url ? (
          <Pressable
            onPress={onRegister}
            className="mt-3 min-h-[48px] flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 active:opacity-92"
            accessibilityRole="button"
            accessibilityLabel={t('hub.work.registerA11y', { name })}
          >
            <Ionicons name="open-outline" size={20} color={colors.onPrimary} />
            <Text style={{ fontFamily: f.bold }} className="text-[16px] text-on-primary">
              {t('hub.work.registerOnline')}
            </Text>
          </Pressable>
        ) : null}

        {!url && tel ? (
          <Pressable
            onPress={onCall}
            className="mt-3 min-h-[48px] flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 active:opacity-92"
            accessibilityRole="button"
            accessibilityLabel={t('hub.work.callHelplineA11y', { phone: place.phone })}
          >
            <Ionicons name="call" size={20} color={colors.onPrimary} />
            <Text style={{ fontFamily: f.bold }} className="text-[16px] text-on-primary">
              {place.phone}
            </Text>
          </Pressable>
        ) : null}

        {!url && !tel ? (
          <View className="mt-3 rounded-xl border border-ink/10 bg-surface-inset/80 px-3 py-2.5">
            <Text style={{ fontFamily: f.regular }} className="text-center text-[13px] leading-5 text-ink-muted">
              {t('hub.work.noWebsiteHint')}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
