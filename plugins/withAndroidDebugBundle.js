const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Default React Native / Expo skips JS bundling for the `debug` variant so the app
 * loads from Metro. Sideloaded `assembleDebug` APKs then show "Unable to load script".
 * Setting `debuggableVariants = []` embeds the bundle (expo export:embed) for debug too.
 */
module.exports = function withAndroidDebugBundle(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    let contents = config.modResults.contents;
    if (contents.includes('debuggableVariants = []')) return config;

    const next = contents.replace(
      /\n    \/\* Variants \*\/[\s\S]*?(?=\n    \/\* Bundling \*\/)/,
      `
    /* Variants */
    /* Bundle JS into debug APKs (sideload / install without Metro). */
    debuggableVariants = []
`,
    );

    if (next === contents) {
      console.warn(
        '[withAndroidDebugBundle] Could not patch app/build.gradle Variants block; add debuggableVariants = [] manually.',
      );
      return config;
    }

    config.modResults.contents = next;
    return config;
  });
};
