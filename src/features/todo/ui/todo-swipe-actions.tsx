import { Pencil, Trash2 } from 'lucide-react-native';

import { Pressable, View } from 'react-native';

interface TodoSwipeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ACTION_WIDTH = 36;

/**
 * 투두 스와이프 액션 버튼
 * SRP: 스와이프 시 표시되는 수정/삭제 버튼만 담당
 */
export function TodoSwipeActions({ onEdit, onDelete }: TodoSwipeActionsProps) {
  return (
    <View className="flex-row items-stretch">
      <Pressable
        className="items-center justify-center bg-accent"
        style={{ width: ACTION_WIDTH }}
        onPress={onEdit}
      >
        <Pencil color="#fff" size={16} />
      </Pressable>
      <Pressable
        className="items-center justify-center rounded-r-3 bg-danger"
        style={{ width: ACTION_WIDTH }}
        onPress={onDelete}
      >
        <Trash2 color="#fff" size={16} />
      </Pressable>
    </View>
  );
}
