import type { MemoRatingRow, RatingSection } from './types';

/**
 * 별점 구역 목록 → FlashList 행 목록.
 * 메모가 없는(total 0) 구역은 생략하고, 모든 구역이 비면 빈 배열 (= 빈 상태)
 */
export function buildMemoRatingRows(sections: RatingSection[]): MemoRatingRow[] {
  const rows: MemoRatingRow[] = [];

  for (const { rating, total, memos } of sections) {
    if (total <= 0) continue;

    rows.push({
      type: 'header',
      key: `header-${rating}`,
      rating,
      total,
      hasMore: total > memos.length,
      gapBefore: rows.length > 0,
    });
    for (const memo of memos) {
      rows.push({ type: 'memo', key: `memo-${memo.id}`, rating, memo, gapBefore: false });
    }
  }

  return rows;
}
