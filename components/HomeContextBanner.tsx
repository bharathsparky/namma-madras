import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BannerGradientNoise } from '@/components/BannerGradientNoise';
import { colors, ui } from '@/constants/theme';
import type { Lang } from '@/db/types';
import { useFontFamily } from '@/hooks/useFontFamily';

/** Asphalt brand-forward gradient (consumer Green theme) — solid fills, no blur. */
export function HomeContextBanner({
  lang,
  ctxLabel,
  title,
  subtitle,
}: {
  lang: Lang;
  ctxLabel: string;
  title: string;
  subtitle: string;
}) {
  const f = useFontFamily(lang);
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDim]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        paddingVertical: 18,
        paddingHorizontal: 18,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BannerGradientNoise variant="brand" />
      <View className="flex-row items-center gap-2">
        <Ionicons name="time-outline" size={18} color={ui.onPrimary92} />
        <Text
          style={{ fontFamily: f.medium }}
          className="text-[12px] uppercase tracking-[0.14em] text-white/90"
          numberOfLines={1}
        >
          {ctxLabel}
        </Text>
      </View>
      <Text style={{ fontFamily: f.bold }} className="mt-2 text-xl leading-7 text-white" numberOfLines={3}>
        {title}
      </Text>
      <Text style={{ fontFamily: f.regular }} className="mt-2 text-[15px] leading-5 text-white/88" numberOfLines={4}>
        {subtitle}
      </Text>
    </LinearGradient>
  );
}
