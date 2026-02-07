import { Todo } from '~/entities/todo/model/types';
import { useToast } from '~/shared/lib';
import { Typography } from '~/shared/ui';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {
  useDeleteTodoMutation,
  useToggleTodoMutation,
  useUpdateTodoMutation,
} from '../api/mutations';
import { useCheckAnimation } from '../lib/use-check-animation';
import { TodoCheckbox } from './todo-checkbox';
import { TodoInlineEdit } from './todo-inline-edit';
import { TodoSwipeActions } from './todo-swipe-actions';

interface TodoItemProps {
  todo: Todo;
}

/**
 * 투두 아이템 - 각 하위 컴포넌트/훅을 조합하는 컨테이너
 * SRP: 하위 요소 간의 상호작용 조율만 담당
 */
export function TodoItem({ todo }: TodoItemProps) {
  const toast = useToast();
  const swipeableRef = useRef<Swipeable>(null);

  const [optimisticCompleted, setOptimisticCompleted] = useState(todo.isCompleted);
  const [isEditing, setIsEditing] = useState(false);

  const { animate, checkStyle, circleStyle, contentStyle } = useCheckAnimation(todo.isCompleted);

  useEffect(() => {
    setOptimisticCompleted(todo.isCompleted);
  }, [todo.isCompleted]);

  const toggleMutation = useToggleTodoMutation({
    onError: () => {
      setOptimisticCompleted(todo.isCompleted);
      animate(todo.isCompleted);
      toast.showError('상태 변경에 실패했습니다');
    },
  });

  const deleteMutation = useDeleteTodoMutation({
    onSuccess: () => toast.showSuccess('할 일이 삭제되었습니다'),
    onError: () => toast.showError('삭제에 실패했습니다'),
  });

  const updateMutation = useUpdateTodoMutation({
    onSuccess: () => setIsEditing(false),
    onError: () => toast.showError('수정에 실패했습니다'),
  });

  const handleToggle = useCallback(() => {
    if (isEditing) return;
    const next = !optimisticCompleted;
    setOptimisticCompleted(next);
    animate(next);
    toggleMutation.mutate(todo.id);
  }, [isEditing, optimisticCompleted, animate, toggleMutation, todo.id]);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    Alert.alert('할 일 삭제', `"${todo.title}"을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(todo.id),
      },
    ]);
  }, [todo.id, todo.title, deleteMutation]);

  const handleEdit = useCallback(() => {
    swipeableRef.current?.close();
    setIsEditing(true);
  }, []);

  const handleEditSubmit = useCallback(
    (title: string) => {
      updateMutation.mutate({ id: todo.id, data: { title } });
    },
    [todo.id, updateMutation],
  );

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const isPending = deleteMutation.isPending || updateMutation.isPending;

  return (
    <Swipeable
      ref={swipeableRef}
      enabled={!isEditing}
      friction={2}
      overshootRight={false}
      renderRightActions={() => <TodoSwipeActions onDelete={handleDelete} onEdit={handleEdit} />}
      rightThreshold={40}
    >
      <View>
        <Pressable
          className="flex-row items-center gap-3 rounded-3 bg-surface px-3 py-3"
          disabled={isPending || isEditing}
          style={{ opacity: isPending ? 0.6 : 1 }}
          onPress={handleToggle}
        >
          <TodoCheckbox
            checkStyle={checkStyle}
            circleStyle={circleStyle}
            isCompleted={optimisticCompleted}
          />
          <Animated.View className="flex-1" style={optimisticCompleted ? contentStyle : undefined}>
            {isEditing ? (
              <TodoInlineEdit
                initialTitle={todo.title}
                onCancel={handleEditCancel}
                onSubmit={handleEditSubmit}
              />
            ) : (
              <>
                <Typography
                  className={
                    optimisticCompleted ? 'text-text-muted line-through' : 'text-text-primary'
                  }
                  variant="body"
                >
                  {todo.title}
                </Typography>
                {todo.description && (
                  <Typography
                    className={`mt-0.5 ${optimisticCompleted ? 'text-text-muted' : 'text-text-secondary'}`}
                    variant="footnote"
                  >
                    {todo.description}
                  </Typography>
                )}
              </>
            )}
          </Animated.View>
          {!isEditing && todo.templateId && (
            <View className="rounded-full bg-accent/20 px-2 py-0.5">
              <Typography className="text-accent" variant="caption2">
                반복
              </Typography>
            </View>
          )}
        </Pressable>
      </View>
    </Swipeable>
  );
}
