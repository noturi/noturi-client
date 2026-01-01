import { useUserTheme } from '~/application/providers/theme-provider';
import { useDeleteCalendarMemo } from '~/features/calendar/api';
import { useToast } from '~/shared/lib';
import { MoreVertical, Trash2 } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Alert, Pressable, TouchableOpacity, View } from 'react-native';

interface CalendarMemoDeleteButtonProps {
  memoId: string;
}

export function CalendarMemoDeleteButton({ memoId }: CalendarMemoDeleteButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const toast = useToast();
  const { hexColors } = useUserTheme();

  const deleteMutation = useDeleteCalendarMemo({
    onSuccess: () => {
      toast.showSuccess('일정이 삭제되었습니다.');
      setShowMenu(false);
    },
    onError: () => {
      toast.showError('일정 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    Alert.alert('일정 삭제', '이 일정을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => setShowMenu(false),
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(memoId),
      },
    ]);
  };

  return (
    <View className="relative">
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <View className="p-2">
          <MoreVertical className="text-text-muted" size={18} />
        </View>
      </TouchableOpacity>

      {showMenu && (
        <>
          <View
            className="absolute right-0 top-8 z-[999999] min-w-[120px] rounded-3 border border-border bg-bg-primary"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <TouchableOpacity onPress={handleDelete}>
              <View className="flex-row items-center gap-2 px-3 py-3">
                <Trash2 color="#ef4444" size={16} />
                <Typography color="#ef4444" variant="footnote">
                  삭제
                </Typography>
              </View>
            </TouchableOpacity>
          </View>

          <Pressable
            style={{
              position: 'absolute',
              top: -1000,
              left: -1000,
              right: -1000,
              bottom: -1000,
              zIndex: 999998,
            }}
            onPress={() => setShowMenu(false)}
          />
        </>
      )}
    </View>
  );
}
