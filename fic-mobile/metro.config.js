const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add missing extensions for socket.io-client ESM resolution
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = withNativeWind(config, { input: './src/global.css' });
