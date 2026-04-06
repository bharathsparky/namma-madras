import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/components/SectionHeading';
import { WorkLabourFilterBar } from '@/components/WorkLabourFilterBar';
import { WorkLabourSafetyBanner } from '@/components/WorkLabourSafetyBanner';
import { WorkLabourStandCard } from '@/components/WorkLabourStandCard';
import { WorkMinimumWagesExpandable } from '@/components/WorkMinimumWagesExpandable';
import { WorkRegistrationGuideCard } from '@/components/WorkRegistrationGuideCard';
import { WorkWelfareSchemeCard } from '@/components/WorkWelfareSchemeCard';
import { getGovtSchemes, getLabourStands } from '@/data/seeds/work';
import { haversineKm } from '@/db/queries';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLocationStore } from '@/stores/locationStore';
import { sortWorkPlacesByDistance } from '@/utils/workHubSort';
import { filterLabourStands, type WorkLabourFilterId } from '@/utils/workLabourFilters';

type Props = {
  lang: Lang;
  listCopyNs: string;
};

export function WorkHubBody({ lang, listCopyNs }: Props) {
  const { t } = useTranslation();
  const lat = useLocationStore((s) => s.latitude);
  const lon = useLocationStore((s) => s.longitude);
  const [labourFilter, setLabourFilter] = useState<WorkLabourFilterId>('all');

  const labourStands = useMemo(() => {
    const rows = getLabourStands();
    const filtered = filterLabourStands(rows, labourFilter);
    return sortWorkPlacesByDistance(filtered, lat, lon);
  }, [lat, lon, labourFilter]);

  const schemes = useMemo(() => getGovtSchemes(), []);

  const standsWithDistance = useMemo(() => {
    if (lat == null || lon == null) {
      return labourStands.map((p) => ({ place: p, distanceKm: undefined as number | undefined }));
    }
    return labourStands.map((p) => {
      const d =
        p.latitude != null && p.longitude != null
          ? haversineKm(lat, lon, p.latitude, p.longitude)
          : undefined;
      return { place: p, distanceKm: d };
    });
  }, [labourStands, lat, lon]);

  const k = (key: string) => `${listCopyNs}.${key}`;
  const f = useFontFamily(lang);

  return (
    <View className="px-4 pt-2 pb-1">
      <WorkLabourSafetyBanner lang={lang} />

      <SectionHeading
        lang={lang}
        overline={t(k('labourOverline'))}
        title={t(k('labourTitle'))}
        className="mb-2 mt-1"
      />

      <WorkLabourFilterBar lang={lang} selected={labourFilter} onSelect={setLabourFilter} />

      {standsWithDistance.length > 0 ? (
        standsWithDistance.map(({ place, distanceKm }) => (
          <WorkLabourStandCard key={place.id} place={place} lang={lang} distanceKm={distanceKm} />
        ))
      ) : (
        <View className="mb-3 rounded-2xl border border-ink/10 bg-surface-card-dark px-4 py-3.5">
          <Text style={{ fontFamily: f.regular }} className="text-sm leading-5 text-ink-muted">
            {t(k('labourFilterEmpty'))}
          </Text>
        </View>
      )}

      <SectionHeading
        lang={lang}
        overline={t(k('schemesOverline'))}
        title={t(k('schemesTitle'))}
        className="mb-3 mt-6"
      />

      <WorkRegistrationGuideCard lang={lang} />

      {schemes.map((place) => (
        <WorkWelfareSchemeCard key={place.id} place={place} lang={lang} />
      ))}

      <WorkMinimumWagesExpandable lang={lang} />
    </View>
  );
}
