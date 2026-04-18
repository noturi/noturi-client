import { todoMutationApi } from '~/features/todo/api/apis';
import { invalidateTodoStats } from '~/features/todo/lib/invalidate-todo-cache';

import { useEffect } from 'react';

import * as Linking from 'expo-linking';

import { useQueryClient } from '@tanstack/react-query';

export function useWidgetDeepLink() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const { url } = event;
      const parsed = Linking.parse(url);

      // Handle: noturiclient://todo/toggle/{id}
      if (parsed.path?.startsWith('todo/toggle/')) {
        const todoId = parsed.path.replace('todo/toggle/', '');
        if (todoId) {
          try {
            await todoMutationApi.toggleTodo(todoId);
            await queryClient.invalidateQueries({
              queryKey: ['todos', 'date'],
              exact: false,
            });
            await invalidateTodoStats(queryClient);

            const { reloadWidget } = await import('@modules/widget-bridge');
            await reloadWidget();
          } catch {
            // Toggle failed
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    // Handle initial URL (app opened from widget)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [queryClient]);
}
