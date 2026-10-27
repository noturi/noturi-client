// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

// FSD 레이어 경계: 하위 레이어는 상위 레이어를 import할 수 없다
// shared < entities < features < widgets < pages < application
const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'application'];

// 다른 슬라이스는 public API(index.ts)로만 import (같은 슬라이스 내부는 상대경로)
const DEEP_IMPORT_PATTERN = {
  group: ['~/entities/*/**', '~/features/*/**', '~/widgets/*/**'],
  message:
    '다른 슬라이스는 public API(~/layer/slice)로만 import하세요. 같은 슬라이스 내부는 상대경로를 사용하세요.',
};

const layerBoundaryConfigs = LAYERS.map((layer, i) => {
  const upperLayers = LAYERS.slice(i + 1);
  const patterns = [DEEP_IMPORT_PATTERN];
  if (upperLayers.length > 0) {
    patterns.push({
      group: upperLayers
        .map((upper) => `~/${upper}/**`)
        .concat(upperLayers.map((upper) => `~/${upper}`)),
      message: `${layer} 레이어는 상위 레이어(${upperLayers.join(', ')})를 import할 수 없습니다.`,
    });
  }
  return {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  };
});

module.exports = defineConfig([
  // expo flat config may export a single config or an array. Normalize to array.
  ...[].concat(expoConfig),
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
    },
  },
  ...layerBoundaryConfigs,
  {
    // 디자인 토큰: UI 코드에 hex 색상 리터럴 금지 — 테마 토큰(className / useThemeColor) 또는
    // shared/config/colors.ts의 고정 색상 상수를 사용 (.claude/rules/code-style.md '디자인 토큰')
    files: [
      'src/**/ui/**/*.{ts,tsx}',
      'src/widgets/**/*.{ts,tsx}',
      'src/pages/**/*.{ts,tsx}',
      'app/**/*.{ts,tsx}',
    ],
    ignores: ['src/features/auth/ui/google-icon.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message:
            'hex 색상 하드코딩 금지 — 테마 색상(className, useThemeColor) 또는 ~/shared/config 색상 상수를 사용하세요.',
        },
      ],
    },
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [DEEP_IMPORT_PATTERN] }] },
  },
  {
    // features 슬라이스끼리는 서로 import 금지 — 조합은 widgets/pages에서
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            DEEP_IMPORT_PATTERN,
            {
              group: [
                '~/features/*',
                '~/widgets',
                '~/widgets/**',
                '~/pages/**',
                '~/application/**',
              ],
              message:
                'features는 다른 feature/상위 레이어를 import할 수 없습니다. 조합은 widgets/pages에서 하세요.',
            },
          ],
        },
      ],
    },
  },
]);
