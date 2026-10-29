import { UNRATED, ratingGroupFilter } from './rating-range';

describe('ratingGroupFilter', () => {
  it('N점 그룹은 N.0~N.5', () => {
    expect(ratingGroupFilter(4)).toEqual({ minRating: 4, maxRating: 4.5 });
    expect(ratingGroupFilter(1)).toEqual({ minRating: 1, maxRating: 1.5 });
  });

  // 회귀: 5점 그룹에 maxRating 5.5를 보내 서버가 400으로 거부하던 문제
  it('[회귀] 5점 그룹은 최댓값 5를 넘지 않는다', () => {
    expect(ratingGroupFilter(5)).toEqual({ minRating: 5, maxRating: 5 });
  });

  it('별점 없음 그룹', () => {
    expect(ratingGroupFilter(UNRATED)).toEqual({ hasRating: false });
  });
});
