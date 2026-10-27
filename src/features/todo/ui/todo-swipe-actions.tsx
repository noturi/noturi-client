import { Pencil, Trash2 } from '~/shared/lib/icons';
import { useUserTheme } from '~/shared/lib/theme-context';

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
  const { hexColors, isDark } = useUserTheme();
  // 색 배경(노랑/빨강) 위 아이콘은 두 테마 모두 흰색 — 다크 테마의 primaryText/dangerText는 어두운색이라 대체
  const editIconColor = isDark ? hexColors.textPrimary : hexColors.primaryText;
  const deleteIconColor = isDark ? hexColors.textPrimary : hexColors.dangerText;

  return (
    <View className="flex-row items-stretch">
      <Pressable
        className="items-center justify-center bg-accent"
        style={{ width: ACTION_WIDTH }}
        onPress={onEdit}
      >
        <Pencil color={editIconColor} size={16} />
      </Pressable>
      <Pressable
        className="items-center justify-center rounded-r-3 bg-danger"
        style={{ width: ACTION_WIDTH }}
        onPress={onDelete}
      >
        <Trash2 color={deleteIconColor} size={16} />
      </Pressable>
    </View>
  );
}
