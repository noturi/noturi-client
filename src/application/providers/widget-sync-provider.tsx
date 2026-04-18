import { useWidgetDeepLink } from '~/application/hooks/use-widget-deep-link';
import { useAuth } from '~/entities/auth';
import { todosByDateQuery } from '~/entities/todo/api/queries';
import { formatDateString } from '~/entities/todo/lib/date-utils';

import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export function WidgetSyncProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const appState = useRef(AppState.currentState);
  const today = useMemo(() => formatDateString(new Date()), []);
  const { data } = useQuery({
    ...todosByDateQuery(today),
    enabled: isAuthenticated,
  });

  useWidgetDeepLink();

  // 앱이 포그라운드로 돌아오면 투두 데이터를 다시 가져옴 (위젯에서 변경했을 수 있음)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
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
        const { syncWidgetData } = await import('@modules/widget-bridge');
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
        console.error('[WidgetSync] Sync failed:', e);
      }
    };

    sync();
  }, [data, today]);

  return <>{children}</>;
}
