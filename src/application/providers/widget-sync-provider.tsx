import { syncAuthTokens, syncWidgetData } from '@modules/widget-bridge';
import { useAuth } from '~/entities/auth';
import { formatDateString, todosByDateQuery } from '~/entities/todo';
import { authApi } from '~/features/auth';
import Logger from '~/shared/lib/logger';

import { type ReactNode, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export function WidgetSyncProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const appState = useRef(AppState.currentState);
  // 매 렌더마다 계산 — 앱을 켜 둔 채 자정이 지나도 오늘 날짜 기준으로 위젯에 동기화 (포그라운드 복귀 시 재렌더)
  const today = formatDateString(new Date());
  const { data } = useQuery({
    ...todosByDateQuery(today),
    enabled: isAuthenticated,
  });

  // 로그인 상태가 되면 위젯 전용 세션을 발급받아 위젯에 전달 (앱 실행마다 1회)
  // 위젯은 앱과 별도 세션으로 토큰을 회전하므로 서로의 리프레시 토큰을 무효화하지 않음
  const widgetSessionIssuedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) {
      widgetSessionIssuedRef.current = false;
      return;
    }
    if (Platform.OS !== 'ios' || widgetSessionIssuedRef.current) return;
    widgetSessionIssuedRef.current = true;

    const issue = async () => {
      try {
        const tokens = await authApi.issueWidgetSession();
        await syncAuthTokens(
          tokens.accessToken,
          tokens.refreshToken,
          process.env.EXPO_PUBLIC_BASE_URL ?? '',
        );
      } catch (e) {
        widgetSessionIssuedRef.current = false;
        Logger.warn('[WidgetSync] 위젯 세션 발급 실패:', e);
      }
    };
    issue();
  }, [isAuthenticated]);

  // 앱이 포그라운드로 돌아오면 투두 데이터를 다시 가져옴 (위젯에서 변경했을 수 있음)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current?.match(/inactive|background/) && nextState === 'active') {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [queryClient]);

  useEffect(() => {
    if (!data || Platform.OS === 'web') return;

    const sync = async () => {
      try {
        const widgetData = {
          todos: data.data.map((t) => ({
            id: t.id,
            title: t.title,
            isCompleted: t.isCompleted,
          })),
          date: today,
          rate: data.rate,
          total: data.data.length,
          completed: data.data.filter((t) => t.isCompleted).length,
        };
        await syncWidgetData(widgetData);
      } catch (e) {
        Logger.error('[WidgetSync] Sync failed:', e);
      }
    };

    sync();
  }, [data, today]);

  return <>{children}</>;
}
