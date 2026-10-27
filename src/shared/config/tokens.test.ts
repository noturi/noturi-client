import { FONT_SIZE, RADIUS, SPACING } from './tokens';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindConfig = require('../../../tailwind.config.js');

const { spacing, borderRadius, fontSize } = tailwindConfig.theme.extend as {
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  fontSize: Record<string, [string, unknown]>;
};

const toPx = (record: Record<string | number, number>) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [key, `${value}px`]));

describe('디자인 토큰', () => {
  it('SPACING은 tailwind spacing과 같다', () => {
    expect(toPx(SPACING)).toEqual(spacing);
  });

  it('RADIUS는 tailwind borderRadius와 같다', () => {
    expect(toPx(RADIUS)).toEqual(borderRadius);
  });

  it('FONT_SIZE는 tailwind fontSize와 같다', () => {
    const tailwindSizes = Object.fromEntries(
      Object.entries(fontSize).map(([key, [size]]) => [key, size]),
    );
    expect(toPx(FONT_SIZE)).toEqual(tailwindSizes);
  });
});
