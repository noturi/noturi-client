import { isSentinelInViewport } from './is-sentinel-in-viewport';

describe('isSentinelInViewport', () => {
  const THRESHOLD = 200;

  it('뷰포트가 측정되지 않았으면 false', () => {
    expect(isSentinelInViewport(100, { offsetY: 0, height: 0 }, THRESHOLD)).toBe(false);
  });

  it('스크롤 없이 컨텐츠가 화면보다 짧아 센티넬이 이미 보이면 true', () => {
    expect(isSentinelInViewport(300, { offsetY: 0, height: 800 }, THRESHOLD)).toBe(true);
  });

  it('뷰포트 하단 + threshold 이내면 true', () => {
    expect(isSentinelInViewport(1000, { offsetY: 0, height: 800 }, THRESHOLD)).toBe(true);
    expect(isSentinelInViewport(1500, { offsetY: 600, height: 800 }, THRESHOLD)).toBe(true);
  });

  it('뷰포트 하단 + threshold를 넘으면 false', () => {
    expect(isSentinelInViewport(1001, { offsetY: 0, height: 800 }, THRESHOLD)).toBe(false);
  });

  it('뷰포트 위로 지나간 센티넬은 false', () => {
    expect(isSentinelInViewport(500, { offsetY: 600, height: 800 }, THRESHOLD)).toBe(false);
  });

  it('iOS 바운스로 offset이 음수여도 0 기준으로 판단', () => {
    expect(isSentinelInViewport(0, { offsetY: -50, height: 800 }, THRESHOLD)).toBe(true);
    expect(isSentinelInViewport(1050, { offsetY: -50, height: 800 }, THRESHOLD)).toBe(false);
  });
});
