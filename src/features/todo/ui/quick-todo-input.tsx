import { Plus } from 'lucide-react-native';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { useToast } from '~/shared/lib';

import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import { useCreateTodoMutation } from '../api/mutations';

interface QuickTodoInputProps {
  selectedDate: Date;
}

export function QuickTodoInput({ selectedDate }: QuickTodoInputProps) {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const toast = useToast();
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
        onError: (error) => {
          console.error('Todo create error:', error);
          toast.showError('투두 생성에 실패했습니다');
        },
      },
    );
  };

  const hasText = title.trim().length > 0;

  return (
    <View
      className={`flex-row items-center gap-2 rounded-3 border bg-surface px-3 py-2 ${
        isFocused ? 'border-primary' : 'border-border'
      }`}
    >
      <Plus color="#888" size={16} />
      <TextInput
        ref={inputRef}
        className="flex-1 py-1 font-sans-regular text-base text-text-primary"
        editable={!createTodoMutation.isPending}
        placeholder="할 일 추가"
        placeholderTextColor="#9e9e9e"
        returnKeyType="done"
        value={title}
        onBlur={() => setIsFocused(false)}
        onChangeText={setTitle}
        onFocus={() => setIsFocused(true)}
        onSubmitEditing={handleSubmit}
      />
      {hasText && (
        <Pressable
          className="rounded-2 bg-primary px-3 py-1"
          disabled={createTodoMutation.isPending}
          onPress={handleSubmit}
        >
          {createTodoMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Plus color="#fff" size={16} />
          )}
        </Pressable>
      )}
    </View>
  );
}
