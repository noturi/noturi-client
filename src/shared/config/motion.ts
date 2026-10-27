/**
 * 모션 토큰 — Seed Design(daangn/seed-design rootage duration·timing-function) 구조를 따름.
 * 값은 기존 애니메이션과 동일하게 유지 (토큰화로 인한 체감 변화 없음).
 */

/** 지속 시간 스케일 (ms) — 50ms 단위 */
export const DURATION = {
  d1: 50,
  d2: 100,
  d3: 150,
  d4: 200,
  d5: 250,
  d6: 300,
  /** 진행률 링 채움처럼 값 변화를 따라가는 긴 전환 */
  progress: 600,
  /** 스켈레톤 깜빡임 반주기 */
  skeletonPulse: 800,
} as const;

/**
 * 이징 곡선 (cubic-bezier 제어점) — 순수 데이터.
 * Reanimated Easing 함수는 `~/shared/lib`의 `EASING`을 사용 (config는 런타임 라이브러리에 의존하지 않음)
 */
export const EASING_CURVE = {
  /** 펼침/접힘 등 일반 상태 전환 */
  standard: [0.4, 0, 0.2, 1],
  /** 들어오는 요소/회전 — 빠르게 시작해 부드럽게 멈춤 (Seed enter와 유사) */
  enter: [0, 0, 0.2, 1],
} as const;

/** 탭 바운스(찌그러짐 → 튀어오름 → 안착) 단계별 시간 */
export const BOUNCE_DURATION = {
  squash: 80,
  overshoot: 120,
  settle: DURATION.d2,
} as const;
