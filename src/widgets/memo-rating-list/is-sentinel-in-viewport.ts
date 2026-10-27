export type ScrollViewport = {
  /** 현재 스크롤 오프셋 (contentOffset.y) */
  offsetY: number;
  /** ScrollView가 화면에 보여주는 높이 (측정 전이면 0) */
  height: number;
};

/**
 * 센티넬(스크롤 컨텐츠 기준 y좌표)이 뷰포트 하단 + threshold 안에 들어왔는지 판단한다.
 * - 뷰포트가 아직 측정되지 않았으면(height <= 0) 판단하지 않는다.
 * - 이미 뷰포트 위로 지나간 센티넬은 무시한다 (위쪽에 아이템이 끼어들어 화면이 밀리는 것을 방지).
 */
export function isSentinelInViewport(
  sentinelY: number,
  viewport: ScrollViewport,
  threshold: number,
): boolean {
  if (viewport.height <= 0) return false;
  const top = Math.max(0, viewport.offsetY);
  return sentinelY >= top && sentinelY <= top + viewport.height + threshold;
}
