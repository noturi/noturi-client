import {
  getCenterIndexFromOffset,
  getCenterOffset,
  getDateItemWidth,
  getScrollOffsetForIndex,
} from './date-strip-layout';

describe('getDateItemWidth', () => {
  it('패딩을 뺀 너비를 보이는 셀 수로 나눈다', () => {
    expect(getDateItemWidth(390, 32, 7)).toBeCloseTo(358 / 7);
    expect(getDateItemWidth(732, 32, 7)).toBe(100);
  });
});

describe('getCenterOffset', () => {
  it('보이는 셀 수의 절반(내림)을 반환한다', () => {
    expect(getCenterOffset(7)).toBe(3);
    expect(getCenterOffset(6)).toBe(3);
    expect(getCenterOffset(1)).toBe(0);
  });
});

describe('getScrollOffsetForIndex', () => {
  it('index 셀이 가운데 오도록 앞쪽 centerOffset개를 뺀 위치를 반환한다', () => {
    expect(getScrollOffsetForIndex(365, 50, 3)).toBe(362 * 50);
    expect(getScrollOffsetForIndex(3, 50, 3)).toBe(0);
    expect(getScrollOffsetForIndex(0, 50, 3)).toBe(-150);
  });
});

describe('getCenterIndexFromOffset', () => {
  it('오프셋을 셀 너비로 반올림한 뒤 centerOffset을 더한다', () => {
    expect(getCenterIndexFromOffset(0, 50, 3)).toBe(3);
    expect(getCenterIndexFromOffset(124, 50, 3)).toBe(5);
    expect(getCenterIndexFromOffset(125, 50, 3)).toBe(6);
  });

  it('getScrollOffsetForIndex의 역함수다', () => {
    const itemWidth = 358 / 7;
    for (const index of [3, 100, 365, 727]) {
      const offset = getScrollOffsetForIndex(index, itemWidth, 3);
      expect(getCenterIndexFromOffset(offset, itemWidth, 3)).toBe(index);
    }
  });
});
