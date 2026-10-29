import type { UIMemo } from '~/entities/memo';

import { buildMemoRatingRows } from './memo-rating-rows';
import type { MemoRatingRow } from './types';

const memo = (id: string): UIMemo => ({
  id,
  title: `메모 ${id}`,
  category: { id: 'c', name: '카테고리', color: '#fff' },
  content: '',
  rating: 5,
  timeAgo: '방금',
});

const memos = (count: number, prefix = 'm') =>
  Array.from({ length: count }, (_, i) => memo(`${prefix}${i}`));

const shape = (rows: MemoRatingRow[]) => rows.map((row) => `${row.type}:${row.rating}`);

describe('buildMemoRatingRows', () => {
  it('구역마다 header → memo 행들', () => {
    const rows = buildMemoRatingRows([{ rating: 5, total: 2, memos: memos(2) }]);
    expect(shape(rows)).toEqual(['header:5', 'memo:5', 'memo:5']);
    expect(rows.map((row) => row.key)).toEqual(['header-5', 'memo-m0', 'memo-m1']);
  });

  it('메모가 없는 구역은 생략', () => {
    const rows = buildMemoRatingRows([
      { rating: 5, total: 0, memos: [] },
      { rating: 3, total: 1, memos: memos(1) },
    ]);
    expect(shape(rows)).toEqual(['header:3', 'memo:3']);
  });

  it('모든 구역이 비어 있으면 빈 배열 (빈 상태)', () => {
    expect(buildMemoRatingRows([{ rating: 5, total: 0, memos: [] }])).toEqual([]);
  });

  it('보이는 메모보다 더 있을 때만 hasMore', () => {
    const rows = buildMemoRatingRows([
      { rating: 5, total: 120, memos: memos(5) },
      { rating: 4, total: 3, memos: memos(3, 'x') },
    ]);
    const headers = rows.filter((row) => row.type === 'header');
    expect(headers.map((row) => row.type === 'header' && row.hasMore)).toEqual([true, false]);
  });

  it('구역 간격은 첫 구역을 제외한 header에만', () => {
    const rows = buildMemoRatingRows([
      { rating: 5, total: 0, memos: [] },
      { rating: 4, total: 1, memos: memos(1) },
      { rating: 3, total: 1, memos: memos(1, 'x') },
    ]);
    expect(rows.map((row) => `${row.type}:${row.gapBefore}`)).toEqual([
      'header:false',
      'memo:false',
      'header:true',
      'memo:false',
    ]);
  });
});
