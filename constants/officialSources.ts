/**
 * Official government / scheme URLs cited in-app for Play policy (Misleading Claims).
 * Labels use i18n keys under `dataSources.link*`.
 */
export const OFFICIAL_SOURCE_LINKS = [
  { url: 'https://chennaicorporation.gov.in/', labelKey: 'dataSources.linkGcc' as const },
  { url: 'https://www.tn.gov.in/', labelKey: 'dataSources.linkTnGov' as const },
  { url: 'https://nhm.tn.gov.in/', labelKey: 'dataSources.linkNhmTn' as const },
  { url: 'https://www.esic.gov.in/', labelKey: 'dataSources.linkEsic' as const },
  { url: 'https://www.cmchistn.com/', labelKey: 'dataSources.linkCmchis' as const },
  { url: 'https://labour.tn.gov.in/', labelKey: 'dataSources.linkLabourTn' as const },
] as const;
