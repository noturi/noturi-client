import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react-native';
import { todosByDateQuery } from '~/entities/todo/api/queries';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { Skeleton, Typography } from '~/shared/ui';

import { View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { TodoItem } from './todo-item';

interface TodoListProps {
  selectedDate: Date;
}

export function TodoList({ selectedDate }: TodoListProps) {
  const dateString = formatDateString(selectedDate);
  const { data, isPending } = useQuery(todosByDateQuery(dateString));

  const todos = data?.data ?? [];
  const completedCount = todos.filter((t) => t.isCompleted).length;

  if (isPending) {
    return (
      <View className="gap-2">
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
      </View>
    );
  }

  return (
    <View className="gap-3">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-2">
          <Calendar className="text-text-secondary" size={16} />
          <Typography className="text-text-secondary" variant="footnote">
            {format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
          </Typography>
        </View>
        {todos.length > 0 && (
          <Typography className="text-text-secondary" variant="footnote">
            {completedCount}/{todos.length} 완료
          </Typography>
        )}
      </View>

      {/* 목록 */}
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
