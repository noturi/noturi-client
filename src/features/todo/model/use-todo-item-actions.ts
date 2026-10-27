import { Todo } from '~/entities/todo';
import { useToast } from '~/shared/lib';

import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import {
  useDeleteTodoMutation,
  useToggleTodoMutation,
  useUpdateTodoMutation,
} from '../api/mutations';
import { useCheckAnimation } from '../lib/use-check-animation';

/**
 * TodoItem의 mutation/상태 로직을 담당하는 훅
 * SRP: 비즈니스 로직만 담당, UI와 분리
 */
export function useTodoItemActions(todo: Todo) {
  const toast = useToast();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const [optimisticCompleted, setOptimisticCompleted] = useState(todo.isCompleted);
  const [isEditing, setIsEditing] = useState(false);
  const prevServerCompleted = useRef(todo.isCompleted);

  const { animate, checkStyle, circleStyle, contentStyle } = useCheckAnimation(todo.isCompleted);

  useEffect(() => {
    if (todo.isCompleted !== prevServerCompleted.current) {
      prevServerCompleted.current = todo.isCompleted;
      setOptimisticCompleted(todo.isCompleted);
      animate(todo.isCompleted);
    }
  }, [todo.isCompleted, animate]);

  const toggleMutation = useToggleTodoMutation({
    onError: () => {
      setOptimisticCompleted(todo.isCompleted);
      animate(todo.isCompleted);
    },
  });

  const deleteMutation = useDeleteTodoMutation({
    onSuccess: () => toast.showSuccess('할 일이 삭제되었습니다'),
  });

  const updateMutation = useUpdateTodoMutation({
    onSuccess: () => setIsEditing(false),
  });

  const handleToggle = () => {
    if (isEditing) return;
    const next = !optimisticCompleted;
    setOptimisticCompleted(next);
    animate(next);
    toggleMutation.mutate(todo.id);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    Alert.alert('할 일 삭제', `"${todo.title}"을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(todo.id),
      },
    ]);
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    setIsEditing(true);
  };

  const handleEditSubmit = (title: string) => {
    updateMutation.mutate({ id: todo.id, data: { title } });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const isPending = deleteMutation.isPending || updateMutation.isPending;

  return {
    swipeableRef,
    optimisticCompleted,
    isEditing,
    isPending,
    checkStyle,
    circleStyle,
    contentStyle,
    handleToggle,
    handleDelete,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
  };
}
