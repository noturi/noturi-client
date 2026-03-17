import { Todo } from '~/entities/todo/model/types';
import { useToast } from '~/shared/lib';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
    },
  });

  const deleteMutation = useDeleteTodoMutation({
    onSuccess: () => toast.showSuccess('할 일이 삭제되었습니다'),
  });

  const updateMutation = useUpdateTodoMutation({
    onSuccess: () => setIsEditing(false),
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
