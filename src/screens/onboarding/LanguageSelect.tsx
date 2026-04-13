import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MotiView } from 'moti';
import { OnboardingShell } from '@/components/OnboardingShell';
import type { Lang } from '@/db/types';
import { warmShadowKey } from '@/constants/asphalt';
import { colors, onboarding } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import { useLanguageStore } from '@/stores/languageStore';

const TEAL = onboarding.teal;
const SELECTED_BG = onboarding.selectedBg;
const BORDER_GREY = onboarding.borderGrey;
const RADIO_GREY = '#B0A99F';

const LANG_ORDER: { id: Lang; native: string }[] = [
  { id: 'ta', native: 'தமிழ்' },
  { id: 'en', native: 'English' },
  { id: 'hi', native: 'हिंदी' },
];

function fontForLang(id: Lang, en: ReturnType<typeof useFontFamily>, ta: ReturnType<typeof useFontFamily>, hi: ReturnType<typeof useFontFamily>) {
  return id === 'ta' ? ta : id === 'hi' ? hi : en;
}

type BubblePair = { left: string; right: string; leftFont: string; rightFont: string; leftSize: number; rightSize: number };

/** `bubbleFront` (right card) is visually on top — that glyph must match the selected language + script font. */
function getBubblePair(selected: Lang, en: ReturnType<typeof useFontFamily>, ta: ReturnType<typeof useFontFamily>, hi: ReturnType<typeof useFontFamily>): BubblePair {
  switch (selected) {
    case 'ta':
      return {
        left: 'A',
        right: 'அ',
        leftFont: en.bold,
        rightFont: ta.bold,
        leftSize: 15,
        rightSize: 17,
      };
    case 'en':
      return {
        left: 'அ',
        right: 'A',
        leftFont: ta.bold,
        rightFont: en.bold,
        leftSize: 17,
        rightSize: 15,
      };
    case 'hi':
      /** Back: Latin A; front: Devanagari अ (selected script on the overlapping card). */
      return {
        left: 'A',
        right: 'अ',
        leftFont: en.bold,
        rightFont: hi.medium,
        leftSize: 15,
        rightSize: 18,
      };
  }
}

/** Two overlapping speech bubbles — letters update with the selected language. */
function LangBubblesIcon({
  selected,
  en,
  ta,
  hi,
}: {
  selected: Lang;
  en: ReturnType<typeof useFontFamily>;
  ta: ReturnType<typeof useFontFamily>;
  hi: ReturnType<typeof useFontFamily>;
}) {
  const pair = getBubblePair(selected, en, ta, hi);
  return (
    <View key={selected} style={bubbleStyles.wrap} accessibilityElementsHidden importantForAccessibility="no">
      <View style={[bubbleStyles.bubble, bubbleStyles.bubbleBack]}>
        <Text
          style={[
            bubbleStyles.bubbleGlyph,
            { fontFamily: pair.leftFont, fontSize: pair.leftSize },
          ]}
        >
          {pair.left}
        </Text>
      </View>
      <View style={[bubbleStyles.bubble, bubbleStyles.bubbleFront]}>
        <Text
          style={[
            bubbleStyles.bubbleGlyph,
            { fontFamily: pair.rightFont, fontSize: pair.rightSize },
          ]}
        >
          {pair.right}
        </Text>
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  wrap: {
    width: 52,
    height: 48,
    marginTop: 2,
  },
  bubble: {
    position: 'absolute',
    width: 40,
    height: 34,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: onboarding.teal,
    backgroundColor: colors.surfaceCardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleBack: {
    left: 0,
    top: 4,
    transform: [{ rotate: '-7deg' }],
  },
  bubbleFront: {
    right: 0,
    top: 0,
    transform: [{ rotate: '9deg' }],
  },
  bubbleGlyph: {
    color: TEAL,
  },
});

type LangCardProps = {
  lang: (typeof LANG_ORDER)[number];
  selected: boolean;
  onSelect: () => void;
  en: ReturnType<typeof useFontFamily>;
  ta: ReturnType<typeof useFontFamily>;
  hi: ReturnType<typeof useFontFamily>;
};

function LangCard({ lang, selected: isSel, onSelect, en, ta, hi }: LangCardProps) {
  const [pressed, setPressed] = useState(false);
  const f = fontForLang(lang.id, en, ta, hi);

  return (
    <Pressable
      onPress={onSelect}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSel }}
      accessibilityLabel={lang.native}
      style={styles.langCardPressable}
    >
      <MotiView
        animate={{ scale: pressed ? 0.98 : 1 }}
        transition={{ type: 'spring', damping: 16, stiffness: 420 }}
        style={[styles.langCard, isSel ? styles.langCardSelected : styles.langCardUnselected]}
      >
        <View style={[styles.radioOuter, isSel && styles.radioOuterSelected]} accessibilityElementsHidden importantForAccessibility="no">
          {isSel ? <View style={styles.radioInner} /> : null}
        </View>
        <Text style={[styles.langLabel, { fontFamily: f.bold }]} numberOfLines={1}>
          {lang.native}
        </Text>
      </MotiView>
    </Pressable>
  );
}

/**
 * Onboarding step 2 — language selection.
 * Tamil-first default; teal accent; Moti spring on card press.
 */
export default function LanguageSelect() {
  const { t } = useTranslation();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [selected, setSelected] = useState<Lang>('ta');
  const en = useFontFamily('en');
  const ta = useFontFamily('ta');
  const hi = useFontFamily('hi');

  const goPermissions = () => router.push('/onboard/permissions');
  const onContinue = () => void setLanguage(selected).then(goPermissions);

  const ctaLabel =
    selected === 'ta' ? 'தொடரவும்' : selected === 'hi' ? 'जारी रखें' : 'Continue';
  const ctaFont = fontForLang(selected, en, ta, hi);

  return (
    <OnboardingShell
      step={2}
      hero={false}
      onBack={() => router.back()}
      footer={
        <View style={styles.footerWrap}>
          {/*
            Teal fill lives on outer View so Android always paints it (Pressable alone can render
            as white with NativeWind / ripple). TouchableOpacity is transparent on top.
          */}
          <View style={styles.continueBtnChrome} collapsable={false}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onContinue}
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
              style={styles.continueBtnHit}
            >
              <Text style={[styles.continueText, { fontFamily: ctaFont.bold }]}>{ctaLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      <ScrollView
        className="flex-1 -mx-5 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow} accessibilityRole="header">
          <LangBubblesIcon selected={selected} en={en} ta={ta} hi={hi} />
          <View style={styles.headerText}>
            <Text style={[styles.headline, { fontFamily: en.bold }]}>{t('onboarding.langSimpleHeadline')}</Text>
            <Text style={[styles.subtitle, { fontFamily: en.regular }]}>{t('onboarding.chooseLangHint')}</Text>
          </View>
        </View>

        <View style={styles.panel}>
          {LANG_ORDER.map((lang) => (
            <LangCard
              key={lang.id}
              lang={lang}
              selected={selected === lang.id}
              onSelect={() => setSelected(lang.id)}
              en={en}
              ta={ta}
              hi={hi}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 22,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  headline: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkMuted,
  },
  panel: {
    backgroundColor: colors.surfaceCardDark,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(31, 28, 26, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: warmShadowKey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  langCardPressable: {
    width: '100%',
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  langCardSelected: {
    backgroundColor: SELECTED_BG,
    borderColor: onboarding.teal,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  langCardUnselected: {
    backgroundColor: colors.surfaceCardDark,
    borderColor: BORDER_GREY,
    ...Platform.select({
      ios: {
        shadowColor: warmShadowKey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: RADIO_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: onboarding.teal,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: TEAL,
  },
  langLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  footerWrap: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingBottom: 4,
    marginHorizontal: -20,
    paddingHorizontal: 24,
  },
  /** Solid teal layer — not optional for visibility on Android. */
  continueBtnChrome: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: TEAL,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
  continueBtnHit: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 17,
    lineHeight: 22,
    color: colors.onPrimary,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
