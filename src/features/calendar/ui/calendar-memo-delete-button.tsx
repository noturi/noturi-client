import { XStack, YStack } from 'tamagui';
import { useDeleteCalendarMemo } from '~/features/calendar/api';
import { useToast } from '~/shared/lib';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { MoreVertical, Trash2 } from '@tamagui/lucide-icons';

interface CalendarMemoDeleteButtonProps {
  memoId: string;
}

export function CalendarMemoDeleteButton({ memoId }: CalendarMemoDeleteButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const toast = useToast();

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
    <XStack position="relative">
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <YStack padding="$2">
          <MoreVertical color="$textMuted" size={18} />
        </YStack>
      </TouchableOpacity>

      {showMenu && (
        <>
          <YStack
            backgroundColor="$backgroundPrimary"
            borderColor="$border"
            borderRadius="$3"
            borderWidth={1}
            elevation={5}
            minWidth={120}
            position="absolute"
            right={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            top={32}
            zIndex={999999}
          >
            <TouchableOpacity onPress={handleDelete}>
              <XStack
                alignItems="center"
                gap="$2"
                hoverStyle={{
                  backgroundColor: '$backgroundSecondary',
                }}
                paddingHorizontal="$3"
                paddingVertical="$3"
              >
                <Trash2 color="$red10" size={16} />
                <Typography color="$red10" variant="footnote">
                  삭제
                </Typography>
              </XStack>
            </TouchableOpacity>
          </YStack>

          <TouchableOpacity
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999998,
            }}
            onPress={() => setShowMenu(false)}
          />
        </>
      )}
    </XStack>
  );
}
