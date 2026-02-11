import { Todo } from '~/entities/todo/model/types';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useTodoItemActions } from '../model/use-todo-item-actions';
import { TodoCheckbox } from './todo-checkbox';
import { TodoInlineEdit } from './todo-inline-edit';
import { TodoSwipeActions } from './todo-swipe-actions';

interface TodoItemProps {
  todo: Todo;
  readonly?: boolean;
}

/**
 * 투두 아이템 - 순수 UI 조합만 담당
 * 비즈니스 로직은 useTodoItemActions에 위임
 */
export function TodoItem({ todo, readonly = false }: TodoItemProps) {
  const {
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
  } = useTodoItemActions(todo);

  return (
    <Swipeable
      ref={swipeableRef}
      enabled={!isEditing && !readonly}
      friction={2}
      overshootRight={false}
      renderRightActions={() => <TodoSwipeActions onDelete={handleDelete} onEdit={handleEdit} />}
      rightThreshold={40}
    >
      <View>
        <Pressable
          className="flex-row items-center gap-3 rounded-3 bg-surface px-3 py-3"
          disabled={readonly || isPending || isEditing}
          style={{ opacity: readonly ? 0.5 : isPending ? 0.6 : 1 }}
          onPress={handleToggle}
        >
          <TodoCheckbox
            checkStyle={checkStyle}
            circleStyle={circleStyle}
            isCompleted={optimisticCompleted}
          />
          <Animated.View className="flex-1" style={contentStyle}>
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
                  numberOfLines={1}
                  variant="callout"
                >
                  {todo.title}
                </Typography>
                {todo.description && (
                  <Typography
                    className={`mt-0.5 ${optimisticCompleted ? 'text-text-muted' : 'text-text-secondary'}`}
                    numberOfLines={1}
                    variant="caption1"
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
