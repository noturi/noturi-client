import * as Sentry from '@sentry/react-native';

import { isNoiseError } from './sentry-noise';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

/** 개발 모드나 DSN 미설정 시에는 전송하지 않음 */
export const isSentryEnabled = Boolean(dsn) && !__DEV__;

export function initSentry() {
  Sentry.init({
    dsn,
    enabled: isSentryEnabled,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 0.1,
    // 이 서버로 가는 요청에만 trace 헤더를 실어 서버 Sentry 트레이스와 연결
    tracePropagationTargets: process.env.EXPO_PUBLIC_BASE_URL
      ? [process.env.EXPO_PUBLIC_BASE_URL]
      : [],
    sendDefaultPii: false,
    // 전송 직전 마지막 필터 — 네트워크 끊김·타임아웃·요청 취소는 앱 코드와 무관 (정책: shared/api/sentry-policy.ts)
    beforeSend: (event, hint) => (isNoiseError(hint?.originalException) ? null : event),
  });
}

/**
 * 이슈에 사용자 id를 남겨 영향 범위(한 명인지 전체인지)를 판단 — 로그아웃 시 null로 지움
 * 이메일은 넣지 않음 (Apple 가려진 이메일이 많고 sendDefaultPii: false와 맞춤)
 */
export function setSentryUser(userId: string | null | undefined) {
  Sentry.setUser(userId ? { id: userId } : null);
}

export { Sentry };
