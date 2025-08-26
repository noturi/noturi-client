const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases for Metro
config.resolver.alias = {
  '~': path.resolve(__dirname, 'src'),
};

// Also ensure Metro recognizes TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
