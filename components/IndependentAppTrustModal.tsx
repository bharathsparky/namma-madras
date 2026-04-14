import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, onboarding, ui } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

type Props = {
  visible: boolean;
  onAcknowledge: () => void;
  lang: Lang;
};

const CHECK = 22;

/**
 * Blocking trust notice: scroll = disclosure + agreement; Continue is absolutely docked so it cannot be
 * clipped by ScrollView flex bugs (Android/RN often expand ScrollView to content height and push siblings out).
 */
export function IndependentAppTrustModal({ visible, onAcknowledge, lang }: Props) {
  const { t } = useTranslation();
  const f = useFontFamily(lang);
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cardMaxW = Math.min(400, windowWidth - 32);
  const panelMaxH = Math.min(windowHeight - insets.top - insets.bottom - 24, 560);
  const [agreed, setAgreed] = useState(false);
  /** Measured docked footer height (CTA strip only — keeps padding accurate on Android). */
  const [footerBlockH, setFooterBlockH] = useState(120);

  useEffect(() => {
    if (visible) setAgreed(false);
  }, [visible]);

  const onFooterLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setFooterBlockH(h);
  }, []);

  const canContinue = agreed;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        /* Blocking until acknowledged */
      }}
    >
      <View style={[styles.overlay, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
        <View style={[styles.card, { maxWidth: cardMaxW, width: '100%', height: panelMaxH, maxHeight: panelMaxH }]}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 + footerBlockH }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            bounces={false}
          >
            <View style={styles.headRow}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} style={styles.headIcon} />
              <Text style={[styles.title, { fontFamily: f.bold }]} accessibilityRole="header">
                {t('trustNotice.title')}
              </Text>
            </View>

            <Text style={[styles.bodyLabel, { fontFamily: f.medium }]}>{t('trustNotice.disclosureLabel')}</Text>
            <Text style={[styles.body, { fontFamily: f.regular }]}>{t('trustNotice.body')}</Text>

            <Text style={[styles.agreementCaption, { fontFamily: f.medium }]}>
              {t('trustNotice.agreementCaption')}
            </Text>

            <Pressable
              onPress={() => setAgreed(!agreed)}
              style={({ pressed }) => [styles.agreementRow, pressed && styles.rowPressed]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
              accessibilityLabel={t('trustNotice.agreeLabel')}
            >
              <View style={styles.checkBoxWrap}>
                <View style={[styles.checkBox, agreed && styles.checkBoxOn]}>
                  {agreed ? (
                    <Ionicons name="checkmark" size={14} color={onboarding.onTeal} accessibilityElementsHidden />
                  ) : null}
                </View>
              </View>
              <Text style={[styles.agreeText, { fontFamily: f.regular }]}>{t('trustNotice.agreeLabel')}</Text>
            </Pressable>

            {/*
              Legal note lives in the scroll area so the docked footer stays short. On Android, overflow:hidden
              on the card clips the top of a tall absolute footer — the CTA was above the disclaimer and disappeared.
            */}
            <Text style={[styles.footerNoteInScroll, { fontFamily: f.regular }]}>{t('trustNotice.footerNote')}</Text>
          </ScrollView>

          <View style={styles.actionFooter} onLayout={onFooterLayout} collapsable={false}>
            {!canContinue ? (
              <Text style={[styles.ctaHint, { fontFamily: f.regular }]}>{t('trustNotice.ctaHint')}</Text>
            ) : null}
            <Pressable
              onPress={onAcknowledge}
              disabled={!canContinue}
              style={({ pressed }) => [
                styles.primaryBtn,
                !canContinue && styles.primaryBtnDisabled,
                canContinue && pressed && styles.primaryBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canContinue }}
              accessibilityLabel={t('trustNotice.continueCta')}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { fontFamily: f.bold },
                  !canContinue && styles.primaryBtnTextDisabled,
                ]}
              >
                {t('trustNotice.continueCta')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 28, 26, 0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'column',
    /** Explicit height so ScrollView flex:1 leaves room for the footer (Continue always on-card). */
    borderRadius: 20,
    backgroundColor: colors.surfaceCardDark,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.dividerSubtle,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(31, 28, 26, 0.22)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 28,
      },
      android: { elevation: 14 },
      default: {},
    }),
  },
  /** Sole flex child: fills card; footer is out-of-flow (absolute) so ScrollView cannot steal its space. */
  scroll: {
    flex: 1,
    minHeight: 0,
    zIndex: 0,
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headIcon: {
    marginRight: 10,
    marginTop: 1,
  },
  title: {
    flex: 1,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  bodyLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: ui.captionWarm,
    marginBottom: 16,
  },
  agreementCaption: {
    fontSize: 13,
    color: colors.ink,
    marginBottom: 10,
  },
  /** Standard ToS row: box on the left, label wraps on the right (no gap — wider RN compat). */
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: ui.neutralWash,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.dividerSubtle,
  },
  checkBoxWrap: {
    marginRight: 12,
    paddingTop: 1,
    flexShrink: 0,
  },
  rowPressed: {
    opacity: 0.92,
  },
  checkBox: {
    width: CHECK,
    height: CHECK,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ui.railFallback,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCardDark,
  },
  checkBoxOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  agreeText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  actionFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ui.dividerSubtle,
    backgroundColor: colors.surfaceCardDark,
    ...Platform.select({
      /** Must exceed ScrollView default draw order on Android so the CTA paints on top. */
      android: { elevation: 12 },
      default: {},
    }),
  },
  primaryBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: onboarding.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: onboarding.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  primaryBtnDisabled: {
    backgroundColor: 'rgba(0, 105, 92, 0.26)',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnPressed: {
    opacity: 0.9,
  },
  primaryBtnText: {
    fontSize: 17,
    letterSpacing: -0.2,
    color: onboarding.onTeal,
  },
  primaryBtnTextDisabled: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  ctaHint: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.inkMuted,
  },
  footerNoteInScroll: {
    marginTop: 14,
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
