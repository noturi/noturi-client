import { Platform } from 'react-native';

import { requireOptionalNativeModule } from 'expo-modules-core';

const WidgetBridge = requireOptionalNativeModule('WidgetBridge');

export interface WidgetTodoData {
  todos: { id: string; title: string; isCompleted: boolean }[];
  date: string;
  rate: number;
  total: number;
  completed: number;
}

export async function syncWidgetData(data: WidgetTodoData): Promise<void> {
  if (Platform.OS === 'web' || !WidgetBridge) return;
  const json = JSON.stringify({ ...data, lastUpdated: new Date().toISOString() });
  return WidgetBridge.syncWidgetData(json);
}

export async function syncAuthTokens(
  accessToken: string,
  refreshToken: string,
  baseUrl: string,
): Promise<void> {
  if (Platform.OS === 'web' || !WidgetBridge) return;
  return WidgetBridge.syncAuthTokens(accessToken, refreshToken, baseUrl);
}

/** 로그아웃 시 위젯 토큰·데이터 삭제 */
export async function clearAuthTokens(): Promise<void> {
  if (Platform.OS === 'web' || !WidgetBridge) return;
  return WidgetBridge.clearAuthTokens();
}

export async function reloadWidget(): Promise<void> {
  if (Platform.OS === 'web' || !WidgetBridge) return;
  return WidgetBridge.reloadWidget();
}
