import { Plus } from 'lucide-react-native';
import { formatDateString } from '~/entities/todo/lib/date-utils';
import { useToast } from '~/shared/lib';
import { Button } from '~/shared/ui';

import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

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
          placeholder="할 일 추가..."
          placeholderTextColor="#9e9e9e"
          returnKeyType="done"
          style={{
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            padding: 0,
            margin: 0,
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
        <Plus color="#fff" size={16} />
      </Button>
    </View>
  );
}
