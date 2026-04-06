# Google Play — release checklist

## Before first upload

1. **Developer account:** Complete Play Console registration and create the app listing.
2. **Application ID:** `com.nammamadras.app` (see `app.json`). Do not change after first release without migration plan.
3. **Signing:** Run `eas build --platform android --profile production` after `eas login` and `eas init`. Use Play App Signing (recommended).
4. **Maps:** In-app maps use `react-native-maps` with each platform’s **default** map provider. Avoid `provider={null}` — it triggers a render crash on iOS (and in Expo Go) inside `react-native-maps`’ provider lookup.

## Play Console — required declarations

- **Privacy policy URL:** Host [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) (or equivalent) on HTTPS; link it in Play Console.
- **Data safety form:** Declare approximate location (if used), optional notifications, and that data is processed on-device where applicable. No data sale.
- **Content rating:** Complete IARC questionnaire (expected: Everyone / low maturity).
- **Target API:** Expo SDK 54 sets a Play-compliant target; re-check [Google’s target API policy](https://support.google.com/googleplay/android-developer/answer/11926878) before each yearly update.

## Store listing (Tamil primary, per PRD)

- **App name:** Namma Madras — நம்ம மெட்ராஸ்  
- **Short description (ta-IN, ≤80 chars):** சென்னையில் இலவச உணவு, தங்குமிடம், மருத்துவம் — அனைத்தும் ஒரே இடத்தில்.  
- **Category:** Social (or similar non-game category aligned with your positioning).  
- **Screenshots:** Capture 5 Tamil UI screens — Home, Food list, Place detail, Emergency, Near Me (with map online).

## Testing tracks

1. Internal testing (AAB from EAS).  
2. Closed testing with a small NGO/stakeholder group.  
3. Production rollout.

## Backup distribution

Build a signed APK with EAS `preview` profile (or `production` with `buildType: apk`) and attach to GitHub Releases if you maintain a public repo, per PRD.

## EAS project

Run `eas init` in the repo root to link an Expo project and enable cloud builds. Remove this note once `eas.json` is linked.
