import { Check, X } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';

import { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { TODO_INPUT_BASE_STYLE } from '../lib/todo-input-styles';

interface TodoInlineEditProps {
  initialTitle: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

/**
 * 투두 인라인 수정 입력
 * SRP: 텍스트 수정 입력과 제출/취소만 담당
 */
export function TodoInlineEdit({ initialTitle, onSubmit, onCancel }: TodoInlineEditProps) {
  const { hexColors } = useUserTheme();
  const [editTitle, setEditTitle] = useState(initialTitle);
  const isSubmittingRef = useRef(false);

  const handleSubmit = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === initialTitle) {
      onCancel();
    } else {
      onSubmit(trimmed);
    }
  };

  return (
    <View className="flex-row items-center gap-1">
      <TextInput
        autoFocus
        className="flex-1"
        maxLength={100}
        returnKeyType="done"
        style={{
          ...TODO_INPUT_BASE_STYLE,
          color: hexColors.textPrimary,
          borderBottomWidth: 1,
          borderBottomColor: hexColors.primary,
          paddingBottom: 2,
        }}
        value={editTitle}
        onBlur={handleSubmit}
        onChangeText={setEditTitle}
        onSubmitEditing={handleSubmit}
      />
      <Pressable className="p-1" onPress={handleSubmit}>
        <Check className="text-primary" size={18} />
      </Pressable>
      <Pressable className="p-1" onPress={onCancel}>
        <X className="text-text-muted" size={18} />
      </Pressable>
    </View>
  );
}
