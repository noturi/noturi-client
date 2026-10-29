import type { UIMemo } from '~/entities/memo';

/** 별점 구역 하나 — 홈은 최근 몇 개만 보여주고 나머지는 "전체" 화면에서 */
export type RatingSection = {
  rating: number;
  /** 구역의 전체 메모 수 */
  total: number;
  memos: UIMemo[];
};

/**
 * FlashList에 그리는 평탄화된 행 — 구역마다 header → memo*.
 * `gapBefore`: 구역 사이 간격 — 첫 구역을 제외한 각 header에만 true
 */
export type MemoRatingRow =
  | {
      type: 'header';
      key: string;
      rating: number;
      total: number;
      hasMore: boolean;
      gapBefore: boolean;
    }
  | { type: 'memo'; key: string; rating: number; memo: UIMemo; gapBefore: false };
