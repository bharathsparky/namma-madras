import { Platform, type ViewStyle } from 'react-native';

/**
 * Hub filter / sort pills (`HubFilterPill`) — squircle (not capsule): moderate radius + iOS
 * continuous curve. Matches ~⅓ of typical row height at 36px min-height (8px grid: 12).
 */
export const FILTER_PILL_SQUIRCLE: ViewStyle = {
  borderRadius: 12,
  ...Platform.select({
    ios: { borderCurve: 'continuous' as const },
    default: {},
  }),
};

/**
 * List toolbar alignment — matches `SectionHeading` (px-4 gutter + 4px rail + 12px gap).
 * Use as ScrollView `contentContainerStyle.paddingLeft` when the scroll sits inside `px-4`.
 */
export const LIST_TOOLBAR_GUTTER = 16;
/** Sum of rail width + `gap-3` before title text — aligns chip row with heading copy. */
export const LIST_TOOLBAR_LEADING_TRIM = 16;

/** Shared horizontal chip row — `HomeFoodFilterBar`, hub filter bars, etc. */
export const HUB_FILTER_SCROLL_CONTENT_STYLE = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 10,
  paddingLeft: LIST_TOOLBAR_LEADING_TRIM,
  paddingRight: 20,
  paddingVertical: 2,
};
