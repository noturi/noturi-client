import type { NativeIntent } from 'expo-router';

/**
 * 이전 버전 위젯의 체크 링크 noturiclient://todo/toggle/{id}
 * 링크로 상태를 바꾸지 않으므로(외부에서 같은 링크로 조작 가능) 할 일 탭으로만 이동시킨다
 * (그대로 두면 존재하지 않는 경로라 +not-found로 이동)
 */
export const redirectSystemPath: NativeIntent['redirectSystemPath'] = ({ path }) => {
  if (path.includes('todo/toggle/')) {
    return '/todo';
  }
  return path;
};
