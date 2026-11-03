const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');
const fs = require('fs');
const path = require('path');

// Sentry: 번들에 디버그 ID를 주입해 소스맵과 매칭 (getDefaultConfig 대체)
const config = getSentryExpoConfig(__dirname);

// Add path aliases for Metro
config.resolver.alias = {
  '~': path.resolve(__dirname, 'src'),
};

// 아이콘 개별 import — 'lucide-react-native/icon/star' → 해당 아이콘 파일 하나만 번들에 포함
// (패키지 루트를 import하면 아이콘 3,300여 개가 모두 들어감. 패키지 exports에 개별 경로가 없어 여기서 연결)
const LUCIDE_ICON_PREFIX = 'lucide-react-native/icon/';
const lucideIconsDir = path.join(
  fs.realpathSync(path.resolve(__dirname, 'node_modules/lucide-react-native')),
  'dist/esm/icons',
);
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith(LUCIDE_ICON_PREFIX)) {
    const filePath = path.join(lucideIconsDir, `${moduleName.slice(LUCIDE_ICON_PREFIX.length)}.js`);
    if (!fs.existsSync(filePath)) throw new Error(`[metro] lucide 아이콘 파일 없음: ${moduleName}`);
    return { type: 'sourceFile', filePath };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Also ensure Metro recognizes TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = withNativeWind(config, { input: './global.css' });
