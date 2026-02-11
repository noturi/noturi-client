import { Plus } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { Button } from '~/shared/ui';

import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { useCreateTodoMutation } from '../api/mutations';
import { TODO_INPUT_BASE_STYLE } from '../lib/todo-input-styles';

interface QuickTodoInputProps {
  selectedDate: Date;
}

export function QuickTodoInput({ selectedDate }: QuickTodoInputProps) {
  const { hexColors } = useUserTheme();
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const createTodoMutation = useCreateTodoMutation();

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createTodoMutation.mutate(
      {
        title: trimmedTitle,
        date: formatDateString(selectedDate),
        recurrenceType: 'NONE',
      },
      {
        onSuccess: () => {
          setTitle('');
          inputRef.current?.focus();
        },
      },
    );
  };

  const hasText = title.trim().length > 0;

  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`flex-1 rounded-3 border bg-surface px-4 ${
          isFocused ? 'border-primary' : 'border-border'
        }`}
        style={{ height: 32, justifyContent: 'center' }}
      >
        <TextInput
          ref={inputRef}
          editable={!createTodoMutation.isPending}
          maxLength={100}
          placeholder="할 일 추가..."
          placeholderTextColor={hexColors.textMuted}
          returnKeyType="done"
          style={{
            ...TODO_INPUT_BASE_STYLE,
            color: hexColors.textPrimary,
          }}
          value={title}
          onBlur={() => setIsFocused(false)}
          onChangeText={setTitle}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <Button
        isIconOnly
        isDisabled={!hasText}
        isLoading={createTodoMutation.isPending}
        size="sm"
        onPress={handleSubmit}
      >
        <Plus color={hexColors.primaryText} size={16} />
      </Button>
    </View>
  );
}
