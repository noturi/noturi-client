import type { MemoRatingRow, RatingGroup } from './types';

/** 그룹 끝에서 이 개수 안의 메모 행이 보이면 다음 페이지를 미리 요청 (행 ≈ 28px → 약 280px 앞) */
export const PREFETCH_ROWS = 10;

type RowSourceGroup = Pick<
  RatingGroup,
  'rating' | 'memos' | 'total' | 'isLoading' | 'isFetchingNextPage'
>;

/**
 * 별점 그룹 목록 → FlashList 행 목록.
 * - 로딩 중 그룹: skeleton 한 행
 * - 메모가 없는(total 0) 그룹: 생략
 * - 접힌 그룹: header만 / 펼친 그룹: header + memo 행들 + footer(카드 하단 · 다음 페이지 로딩 표시)
 * 모든 그룹이 생략되면 빈 배열 (= 빈 상태)
 */
export function buildMemoRatingRows(
  groups: RowSourceGroup[],
  collapsedGroups: Record<number, boolean>,
): MemoRatingRow[] {
  const rows: MemoRatingRow[] = [];

  for (const group of groups) {
    const { rating } = group;
    const gapBefore = rows.length > 0;

    if (group.isLoading) {
      rows.push({ type: 'skeleton', key: `skeleton-${rating}`, rating, gapBefore });
      continue;
    }
    if (group.total <= 0) continue;

    const isExpanded = !collapsedGroups[rating];
    rows.push({
      type: 'header',
      key: `header-${rating}`,
      rating,
      total: group.total,
      isExpanded,
      gapBefore,
    });
    if (!isExpanded) continue;

    const lastIndex = group.memos.length - 1;
    group.memos.forEach((memo, index) => {
      rows.push({
        type: 'memo',
        // 페이지 사이에 별점이 바뀐 메모가 두 그룹에 잠깐 겹칠 수 있어 그룹을 키에 포함
        key: `memo-${rating}-${memo.id}`,
        rating,
        memo,
        isNearGroupEnd: lastIndex - index < PREFETCH_ROWS,
        gapBefore: false,
      });
    });
    rows.push({
      type: 'footer',
      key: `footer-${rating}`,
      rating,
      isFetchingNextPage: group.isFetchingNextPage,
      gapBefore: false,
    });
  }

  return rows;
}

/**
 * 화면에 보이는 행 → 다음 페이지를 불러올 그룹.
 * 그룹의 footer나 끝 근처 메모 행이 보이고, 다음 페이지가 있으며 아직 불러오는 중이 아닌 그룹만.
 */
export function selectGroupsToFetch<
  G extends Pick<RatingGroup, 'rating' | 'hasNextPage' | 'isFetchingNextPage'>,
>(visibleRows: MemoRatingRow[], groups: G[]): G[] {
  const ratings = new Set<number>();
  for (const row of visibleRows) {
    if (row.type === 'footer' || (row.type === 'memo' && row.isNearGroupEnd)) {
      ratings.add(row.rating);
    }
  }
  return groups.filter(
    (group) => ratings.has(group.rating) && group.hasNextPage && !group.isFetchingNextPage,
  );
}
