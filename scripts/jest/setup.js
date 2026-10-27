// Reanimated / Worklets 공식 mock — 네이티브 런타임 없이 Jest에서 import 가능하게 함
// (Reanimated 4.7부터 실제 모듈 초기화(setUpTests)는 CSS 핸들러가 없는 JS 런타임에서 실패)
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Sentry — 테스트에서는 전송하지 않도록 no-op mock
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: (component) => component,
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
}));
