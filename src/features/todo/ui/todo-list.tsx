import { addDays } from 'date-fns';
import { todosByDateQuery } from '~/entities/todo/api/queries';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { Skeleton, Typography } from '~/shared/ui';

import { useEffect } from 'react';
import { View } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { TodoItem } from './todo-item';

interface TodoListProps {
  selectedDate: Date;
}

export function TodoList({ selectedDate }: TodoListProps) {
  const dateString = formatDateString(selectedDate);
  const queryClient = useQueryClient();
  const { data, isPending, isPlaceholderData } = useQuery(todosByDateQuery(dateString));

  // 인접 날짜 prefetch (전후 1일)
  useEffect(() => {
    const prev = formatDateString(addDays(selectedDate, -1));
    const next = formatDateString(addDays(selectedDate, 1));
    queryClient.prefetchQuery(todosByDateQuery(prev));
    queryClient.prefetchQuery(todosByDateQuery(next));
  }, [selectedDate, queryClient]);

  const todos = data?.data ?? [];
  const completedCount = todos.filter((t) => t.isCompleted).length;

  // 최초 로딩만 스켈레톤 (placeholderData가 있으면 스켈레톤 안 보임)
  if (isPending && !isPlaceholderData) {
    return (
      <View className="gap-2">
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
      </View>
    );
  }

  return (
    <View className="gap-3" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
      {todos.length > 0 && (
        <View className="flex-row items-center justify-end px-1">
          <Typography className="text-text-secondary" variant="footnote">
            {completedCount}/{todos.length} 완료
          </Typography>
        </View>
      )}

      {todos.length === 0 ? (
        <View className="items-center justify-center rounded-4 bg-surface py-12">
          <Typography className="text-text-muted" variant="body">
            등록된 할 일이 없어요
          </Typography>
          <Typography className="mt-1 text-text-muted" variant="footnote">
            위에서 새로운 할 일을 추가해보세요
          </Typography>
        </View>
      ) : (
        <View className="gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </View>
      )}
    </View>
  );
}
