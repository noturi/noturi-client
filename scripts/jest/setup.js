// Reanimated 4 / Worklets 공식 Jest 설정 — 네이티브 worklets 런타임을 mock으로 대체
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
require('react-native-reanimated').setUpTests();
