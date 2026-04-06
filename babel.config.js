module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Required by NativeWind (react-native-css-interop); must stay last.
    plugins: ['react-native-reanimated/plugin'],
  };
};
