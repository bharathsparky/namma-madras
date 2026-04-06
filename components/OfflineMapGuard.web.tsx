import type { ReactNode } from 'react';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import type { Lang } from '@/db/types';

type Props = {
  latitude: number;
  longitude: number;
  address: string;
  lang?: Lang;
  children?: ReactNode;
};

/** Web: native uses static map preview + Google Maps link; same placeholder UX as offline native. */
export function OfflineMapGuard({ address, lang = 'en' }: Props) {
  return <MapPlaceholder address={address} lang={lang} />;
}
