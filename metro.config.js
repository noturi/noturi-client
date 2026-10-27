const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Sentry: 번들에 디버그 ID를 주입해 소스맵과 매칭 (getDefaultConfig 대체)
const config = getSentryExpoConfig(__dirname);

// Add path aliases for Metro
config.resolver.alias = {
  '~': path.resolve(__dirname, 'src'),
};

// Also ensure Metro recognizes TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = withNativeWind(config, { input: './global.css' });
