/**
 * 디자인 토큰 (숫자 스케일)
 *
 * tailwind.config.js의 spacing / borderRadius / fontSize 스케일과 같은 값이다.
 * - className에서는 `p-5`, `rounded-5`, `text-4`처럼 Tailwind 클래스를 쓰고
 * - style 객체(StyleSheet, reanimated, 서드파티 theme 등)에서만 이 상수를 쓴다.
 * 두 곳의 값은 tokens.test.ts가 동기화를 검증한다.
 */

/** px — Tailwind `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `inset-*` */
export const SPACING = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 24,
  7: 32,
  8: 48,
  9: 64,
  10: 88,
  11: 120,
} as const;

/** px — Tailwind `rounded-*` */
export const RADIUS = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 9999,
} as const;

/** px — Tailwind `text-1` ~ `text-7` (lineHeight는 Tailwind 쪽에만 정의) */
export const FONT_SIZE = {
  1: 10,
  2: 12,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 24,
} as const;
