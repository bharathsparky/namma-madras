const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
// Pre-built SQLite shipped as an asset (see assets/db/csg.db + npm run generate:db)
config.resolver.assetExts.push('db');

module.exports = withNativeWind(config, { input: './global.css' });
