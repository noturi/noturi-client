import * as Sentry from '@sentry/react-native';

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
  });
}

export { Sentry };
