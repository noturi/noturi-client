/**
 * 가로 날짜 스트립(WeekDateSelector)의 레이아웃 계산
 * - 화면에 visibleDays개의 셀이 보이고, 선택된 셀은 가운데(centerOffset 위치)에 온다
 */

/**
 * 셀 하나의 너비
 */
export function getDateItemWidth(
  windowWidth: number,
  horizontalPadding: number,
  visibleDays: number,
): number {
  return (windowWidth - horizontalPadding) / visibleDays;
}

/**
 * 가운데에 놓일 셀이 index일 때 앞쪽에 오는 셀 수
 */
export function getCenterOffset(visibleDays: number): number {
  return Math.floor(visibleDays / 2);
}

/**
 * index 셀을 가운데에 두기 위한 스크롤 오프셋
 */
export function getScrollOffsetForIndex(
  index: number,
  itemWidth: number,
  centerOffset: number,
): number {
  return (index - centerOffset) * itemWidth;
}

/**
 * 현재 스크롤 오프셋에서 가운데에 놓인 셀의 인덱스
 */
export function getCenterIndexFromOffset(
  offsetX: number,
  itemWidth: number,
  centerOffset: number,
): number {
  return Math.round(offsetX / itemWidth) + centerOffset;
}
