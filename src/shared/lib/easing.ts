import { EASING_CURVE } from '~/shared/config/motion';

import { Easing } from 'react-native-reanimated';

/** Reanimated 이징 함수 — 모션 토큰(`EASING_CURVE`)을 런타임 함수로 변환 */
export const EASING = {
  standard: Easing.bezier(...EASING_CURVE.standard),
  enter: Easing.bezier(...EASING_CURVE.enter),
  /** 누름 피드백, 내용 페이드 */
  out: Easing.out(Easing.ease),
  /** 값 변화를 따라가는 진행 표시 */
  outCubic: Easing.out(Easing.cubic),
} as const;
