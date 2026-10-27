import type { UIMemo } from '~/entities/memo';

import { PREFETCH_ROWS, buildMemoRatingRows, selectGroupsToFetch } from './memo-rating-rows';
import type { MemoRatingRow, RatingGroup } from './types';

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

const group = (overrides: Partial<RatingGroup> & { rating: number }): RatingGroup => ({
  memos: [],
  total: 0,
  isLoading: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: jest.fn(),
  ...overrides,
});

const shape = (rows: MemoRatingRow[]) => rows.map((row) => `${row.type}:${row.rating}`);

describe('buildMemoRatingRows', () => {
  it('펼친 그룹은 header → memo 행들 → footer', () => {
    const rows = buildMemoRatingRows([group({ rating: 5, memos: memos(2), total: 2 })], {});
    expect(shape(rows)).toEqual(['header:5', 'memo:5', 'memo:5', 'footer:5']);
    expect(rows[0]).toMatchObject({ isExpanded: true, total: 2, gapBefore: false });
    expect(rows.map((row) => row.key)).toEqual(['header-5', 'memo-5-m0', 'memo-5-m1', 'footer-5']);
  });

  it('접힌 그룹은 header 한 행만', () => {
    const rows = buildMemoRatingRows([group({ rating: 4, memos: memos(3), total: 3 })], {
      4: true,
    });
    expect(shape(rows)).toEqual(['header:4']);
    expect(rows[0]).toMatchObject({ isExpanded: false });
  });

  it('로딩 중 그룹은 skeleton, 메모가 없는 그룹은 생략', () => {
    const rows = buildMemoRatingRows(
      [
        group({ rating: 5, isLoading: true }),
        group({ rating: 4, total: 0 }),
        group({ rating: 3, memos: memos(1), total: 1 }),
      ],
      {},
    );
    expect(shape(rows)).toEqual(['skeleton:5', 'header:3', 'memo:3', 'footer:3']);
  });

  it('모든 그룹이 비어 있으면 빈 배열 (빈 상태)', () => {
    expect(buildMemoRatingRows([group({ rating: 5 }), group({ rating: 0 })], {})).toEqual([]);
  });

  it('카드 간격은 첫 카드를 제외한 각 카드의 첫 행에만', () => {
    const rows = buildMemoRatingRows(
      [
        group({ rating: 5, total: 0 }),
        group({ rating: 4, memos: memos(1), total: 1 }),
        group({ rating: 3, memos: memos(1, 'x'), total: 1 }),
        group({ rating: 2, isLoading: true }),
      ],
      { 3: true },
    );
    expect(rows.map((row) => `${row.type}:${row.gapBefore}`)).toEqual([
      'header:false',
      'memo:false',
      'footer:false',
      'header:true',
      'skeleton:true',
    ]);
  });

  it('footer는 다음 페이지 로딩 상태를 전달', () => {
    const rows = buildMemoRatingRows(
      [
        group({
          rating: 5,
          memos: memos(1),
          total: 99,
          hasNextPage: true,
          isFetchingNextPage: true,
        }),
      ],
      {},
    );
    expect(rows.at(-1)).toMatchObject({ type: 'footer', isFetchingNextPage: true });
  });

  it(`그룹의 마지막 ${PREFETCH_ROWS}개 메모 행만 isNearGroupEnd`, () => {
    const count = PREFETCH_ROWS + 5;
    const rows = buildMemoRatingRows([group({ rating: 5, memos: memos(count), total: 100 })], {});
    const flags = rows.flatMap((row) => (row.type === 'memo' ? [row.isNearGroupEnd] : []));
    expect(flags.filter((flag) => !flag)).toHaveLength(5);
    expect(flags.slice(5).every(Boolean)).toBe(true);
  });
});

describe('selectGroupsToFetch', () => {
  const groups = [
    group({ rating: 5, memos: memos(30), total: 120, hasNextPage: true }),
    group({
      rating: 4,
      memos: memos(30, 'y'),
      total: 120,
      hasNextPage: true,
      isFetchingNextPage: true,
    }),
    group({ rating: 3, memos: memos(30, 'z'), total: 30, hasNextPage: false }),
  ];
  const rows = buildMemoRatingRows(groups, {});
  const rowsOf = (rating: number) => rows.filter((row) => row.rating === rating);

  it('footer가 보이고 다음 페이지가 있으면 요청 대상', () => {
    const footer = rowsOf(5).filter((row) => row.type === 'footer');
    expect(selectGroupsToFetch(footer, groups).map((g) => g.rating)).toEqual([5]);
  });

  it('끝 근처 메모 행이 보이면 미리 요청, 앞쪽 메모 행이나 header만 보이면 요청 안 함', () => {
    const memoRows = rowsOf(5).filter((row) => row.type === 'memo');
    expect(selectGroupsToFetch(memoRows.slice(-3), groups).map((g) => g.rating)).toEqual([5]);
    expect(selectGroupsToFetch(memoRows.slice(0, 5), groups)).toEqual([]);
    expect(selectGroupsToFetch(rowsOf(5).slice(0, 1), groups)).toEqual([]);
  });

  it('이미 불러오는 중이거나 다음 페이지가 없는 그룹은 제외', () => {
    expect(selectGroupsToFetch([...rowsOf(4), ...rowsOf(3)], groups)).toEqual([]);
  });

  it('같은 그룹의 여러 행이 보여도 한 번만', () => {
    expect(selectGroupsToFetch(rowsOf(5).slice(-5), groups)).toHaveLength(1);
  });
});
