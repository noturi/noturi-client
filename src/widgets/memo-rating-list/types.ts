import type { UIMemo } from '~/entities/memo';

/** 별점 그룹 하나의 데이터 + 페이지네이션 상태 (pages의 무한 쿼리 → 위젯) */
export type RatingGroup = {
  rating: number;
  memos: UIMemo[];
  total: number;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

/**
 * FlashList에 그리는 평탄화된 행.
 * 펼친 그룹은 header → memo* → footer 순으로 이어져 하나의 카드처럼 보이고,
 * 접힌 그룹은 header 한 행이 카드 전체가 된다.
 * `gapBefore`: 카드 사이 간격 — 첫 카드를 제외한 각 카드의 첫 행에만 true
 */
export type MemoRatingRow =
  | { type: 'skeleton'; key: string; rating: number; gapBefore: boolean }
  | {
      type: 'header';
      key: string;
      rating: number;
      total: number;
      isExpanded: boolean;
      gapBefore: boolean;
    }
  | {
      type: 'memo';
      key: string;
      rating: number;
      memo: UIMemo;
      /** 그룹의 마지막 PREFETCH_ROWS개 안에 있는 행 — 보이면 다음 페이지를 미리 요청 */
      isNearGroupEnd: boolean;
      gapBefore: false;
    }
  | { type: 'footer'; key: string; rating: number; isFetchingNextPage: boolean; gapBefore: false };
