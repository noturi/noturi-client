import { Check } from 'lucide-react-native';
import { Todo } from '~/entities/todo/model/types';
import { useToast } from '~/shared/lib';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useToggleTodoMutation } from '../api/mutations';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const toast = useToast();
  const toggleMutation = useToggleTodoMutation({
    onError: () => {
      toast.showError('상태 변경에 실패했습니다');
    },
  });
  const scale = useSharedValue(1);

  const handleToggle = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    toggleMutation.mutate(todo.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className="flex-row items-center gap-3 rounded-3 bg-surface px-3 py-3"
        disabled={toggleMutation.isPending}
        style={{ opacity: toggleMutation.isPending ? 0.6 : 1 }}
        onPress={handleToggle}
      >
        <View
          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
            todo.isCompleted ? 'border-primary bg-primary' : 'border-border'
          }`}
        >
          {todo.isCompleted && <Check color="#fff" size={14} strokeWidth={3} />}
        </View>
        <View className="flex-1">
          <Typography
            className={todo.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'}
            variant="body"
          >
            {todo.title}
          </Typography>
          {todo.description && (
            <Typography
              className={`mt-0.5 ${todo.isCompleted ? 'text-text-muted' : 'text-text-secondary'}`}
              variant="footnote"
            >
              {todo.description}
            </Typography>
          )}
        </View>
        {todo.templateId && (
          <View className="rounded-full bg-accent/20 px-2 py-0.5">
            <Typography className="text-accent" variant="caption2">
              반복
            </Typography>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
