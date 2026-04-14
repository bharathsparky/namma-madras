import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import { OnboardingShell } from '@/components/OnboardingShell';
import { warmShadowKey } from '@/constants/asphalt';
import { colors, onboarding, ui } from '@/constants/theme';
import { useFontFamily } from '@/hooks/useFontFamily';
import type { Lang } from '@/db/types';

const TEAL = onboarding.teal;

const LOGO = require('../../../assets/images/icon.png');

/**
 * Onboarding step 1 — Tamil-first hero (before language pick). English app name / welcome removed;
 * copy uses Tamil keys even when the app default locale is English.
 */
export default function AppIntro() {
  const { t, i18n } = useTranslation();
  const en = useFontFamily('en');
  const ta = useFontFamily('ta');
  const disclaimerLang: Lang = i18n.language?.startsWith('ta')
    ? 'ta'
    : i18n.language?.startsWith('hi')
      ? 'hi'
      : 'en';
  const disclaimerFont = useFontFamily(disclaimerLang);

  const goLanguage = () => router.push('/onboard/language' as never);

  return (
    <OnboardingShell
      step={1}
      hero
      footer={
        /** Match `ScrollView` horizontal rhythm (`-mx-5 px-6`) so the CTA is full column width. */
        <View className="w-full self-stretch -mx-5 px-6 pt-2 pb-1">
          <View style={styles.continueBtnChrome} collapsable={false}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={goLanguage}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.langContinue')}
              style={styles.continueBtnHit}
            >
              <Text style={[styles.continueText, { fontFamily: en.bold }]}>{t('onboarding.langContinue')}</Text>
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
        <MotiView
          from={{ opacity: 0, translateY: 14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 520,
            easing: Easing.out(Easing.cubic),
          }}
        >
          <View style={styles.logoStage} accessibilityRole="image" accessibilityLabel={t('onboarding.logoA11y')}>
            <LinearGradient
              colors={['rgba(0, 105, 92, 0.2)', 'rgba(0, 105, 92, 0.06)', ui.logoHaloFade]}
              locations={[0, 0.45, 1]}
              start={{ x: 0.35, y: 0 }}
              end={{ x: 0.65, y: 1 }}
              style={styles.logoHalo}
            />
            <View style={styles.logoCard}>
              <Image
                source={LOGO}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityElementsHidden
                importantForAccessibility="no"
                accessibilityIgnoresInvertColors
              />
            </View>
          </View>

          <Text style={[styles.kicker, { fontFamily: ta.medium }]}>{t('onboarding.welcomeKicker')}</Text>
          <Text
            style={[styles.brandTitle, { fontFamily: ta.bold }]}
            accessibilityRole="header"
          >
            {t('onboarding.brandHeader')}
          </Text>
          <Text style={[styles.tagline, { fontFamily: ta.regular }]}>{t('onboarding.brandSub')}</Text>

          <Text
            style={[styles.disclaimerShort, { fontFamily: disclaimerFont.regular }]}
            accessibilityRole="text"
          >
            {t('onboarding.disclaimerShort')}
          </Text>

          <View style={styles.divider} importantForAccessibility="no" accessibilityElementsHidden />

          <View style={styles.valueCard}>
            <View style={styles.valueCardAccent} importantForAccessibility="no" accessibilityElementsHidden />
            <Text style={[styles.headline, { fontFamily: ta.bold }]} accessibilityRole="header">
              {t('onboarding.welcomeTitle')}
            </Text>
            <Text style={[styles.body, { fontFamily: ta.regular }]}>{t('onboarding.welcomeBody')}</Text>

            <View style={styles.highlightRow}>
              <View style={styles.highlightIcon} accessibilityElementsHidden importantForAccessibility="no">
                <Ionicons name="sparkles" size={18} color={TEAL} />
              </View>
              <Text style={[styles.highlightText, { fontFamily: ta.medium }]}>{t('onboarding.introTa')}</Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  logoStage: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 148,
    height: 148,
    marginBottom: 8,
  },
  logoHalo: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
  },
  logoCard: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.surfaceCardDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.primaryWash,
    ...Platform.select({
      ios: {
        shadowColor: warmShadowKey,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  kicker: {
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.inkMuted,
    marginBottom: 8,
    textAlign: 'center',
  },
  brandTitle: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.2,
    color: ui.brandTealMuted,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  disclaimerShort: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: 12,
    opacity: 0.92,
  },
  divider: {
    alignSelf: 'center',
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: ui.brandTealLine,
    marginTop: 22,
    marginBottom: 20,
  },
  valueCard: {
    position: 'relative',
    backgroundColor: colors.surfaceCardDark,
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.dividerSubtle,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: warmShadowKey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 22,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  valueCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: TEAL,
    opacity: 0.85,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  headline: {
    fontSize: 21,
    lineHeight: 27,
    letterSpacing: -0.35,
    color: colors.ink,
    paddingLeft: 6,
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
    opacity: 0.88,
    paddingLeft: 6,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(31, 28, 26, 0.07)',
  },
  highlightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: onboarding.iconWashStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ui.primaryBorderMedium,
  },
  highlightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkBrandTeal,
    minWidth: 0,
  },
  continueBtnChrome: {
    width: '100%',
    alignSelf: 'stretch',
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
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
