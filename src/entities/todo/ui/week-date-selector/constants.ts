import { getCenterOffset } from '../../lib/date-strip-layout';

/** 오늘 기준 앞뒤로 렌더링할 일 수 */
export const DAYS_TO_RENDER = 365;
/** 한 화면에 보이는 셀 수 */
export const VISIBLE_DAYS = 7;
/** 스트립을 감싸는 카드의 좌우 패딩 합 */
export const HORIZONTAL_PADDING = 32;
/** 선택된 셀이 가운데 오도록 앞에 두는 셀 수 */
export const CENTER_OFFSET = getCenterOffset(VISIBLE_DAYS);
