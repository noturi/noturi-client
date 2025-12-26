/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 테마 색상 (CSS 변수)
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-text': 'rgb(var(--color-primary-text) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        selection: 'rgb(var(--color-selection) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',

        // 배경 (CSS 변수)
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'bg-overlay': 'rgba(0,0,0,0.5)',

        // 텍스트 (CSS 변수)
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',

        // 테두리 (CSS 변수)
        border: 'rgb(var(--color-border) / <alpha-value>)',

        // 고정 색상 (테마 무관)
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',

        // Rating colors (고정)
        'rating-0-bg': '#f5f5f5',
        'rating-1': '#ff6b35',
        'rating-1-bg': '#fff2ed',
        'rating-2': '#ffa726',
        'rating-2-bg': '#fff8e1',
        'rating-3': '#66bb6a',
        'rating-3-bg': '#f1f8e9',
        'rating-4': '#42a5f5',
        'rating-4-bg': '#e3f2fd',
        'rating-5': '#7e57c2',
        'rating-5-bg': '#f3e5f5',
      },

      // Spacing (Tamagui 토큰 매핑)
      spacing: {
        0: '0px',
        1: '2px',
        2: '4px',
        3: '8px',
        4: '12px',
        5: '16px',
        6: '24px',
        7: '32px',
        8: '48px',
        9: '64px',
        10: '88px',
        11: '120px',
      },

      // Border Radius (Tamagui 토큰 매핑)
      borderRadius: {
        0: '0px',
        1: '2px',
        2: '4px',
        3: '6px',
        4: '8px',
        5: '12px',
        6: '16px',
        7: '20px',
        8: '9999px',
      },

      // Font Size (Tamagui 토큰 매핑)
      fontSize: {
        1: ['10px', { lineHeight: '12px' }],
        2: ['12px', { lineHeight: '14px' }],
        3: ['14px', { lineHeight: '16px' }],
        4: ['16px', { lineHeight: '18px' }],
        5: ['18px', { lineHeight: '20px' }],
        6: ['20px', { lineHeight: '24px' }],
        7: ['24px', { lineHeight: '28px' }],
      },

      // Font Family (Pretendard)
      fontFamily: {
        sans: ['Pretendard-Regular'],
        'sans-thin': ['Pretendard-Thin'],
        'sans-extralight': ['Pretendard-ExtraLight'],
        'sans-light': ['Pretendard-Light'],
        'sans-medium': ['Pretendard-Medium'],
        'sans-semibold': ['Pretendard-SemiBold'],
        'sans-bold': ['Pretendard-Bold'],
        'sans-extrabold': ['Pretendard-ExtraBold'],
        'sans-black': ['Pretendard-Black'],
      },

      // Z-Index (Tamagui 토큰 매핑)
      zIndex: {
        1: '0',
        2: '100',
        3: '200',
        4: '300',
        5: '400',
        6: '500',
      },
    },
  },
  plugins: [],
};
