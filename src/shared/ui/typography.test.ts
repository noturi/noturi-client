import { hasTextColorClass } from './typography';

describe('hasTextColorClass', () => {
  it('글자색 class를 찾는다', () => {
    expect(hasTextColorClass('text-text-muted')).toBe(true);
    expect(hasTextColorClass('flex-1 text-primary-text')).toBe(true);
    expect(hasTextColorClass('mt-1 text-error')).toBe(true);
    expect(hasTextColorClass('text-white')).toBe(true);
  });

  it('크기·정렬 class나 다른 class는 색이 아니다', () => {
    expect(hasTextColorClass('text-center')).toBe(false);
    expect(hasTextColorClass('text-2')).toBe(false);
    expect(hasTextColorClass('text-base font-medium')).toBe(false);
    expect(hasTextColorClass('mt-1 flex-1')).toBe(false);
    expect(hasTextColorClass(undefined)).toBe(false);
  });
});
