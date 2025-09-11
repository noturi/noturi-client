import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button, Text, View, XStack, YStack } from 'tamagui';
import { NotificationMemo } from '~/entities/memo/model/types';
import { NotificationService } from '~/features/notification';
import { Card } from '~/shared/ui/Card';

import { useState } from 'react';

interface NotificationMemoCardProps {
  memo: NotificationMemo;
  onUpdate?: (memo: NotificationMemo) => void;
  onDelete?: (id: string) => void;
}

export function NotificationMemoCard({ memo, onUpdate, onDelete }: NotificationMemoCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelNotification = async () => {
    if (!memo.notificationId) return;

    setIsLoading(true);
    try {
      await NotificationService.cancelNotification(memo.notificationId);
      if (onUpdate) {
        onUpdate({ ...memo, notificationId: undefined, isNotified: true });
      }
    } catch (error) {
      console.error('알림 취소 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatReminderDate = (date: Date) => {
    return format(new Date(date), 'yyyy년 M월 d일 HH:mm', { locale: ko });
  };

  const isOverdue = new Date(memo.reminderDate) < new Date();
  const statusColor = memo.isNotified ? '$green10' : isOverdue ? '$red10' : '$blue10';
  const statusText = memo.isNotified ? '알림 완료' : isOverdue ? '시간 지남' : '알림 예약됨';

  return (
    <Card marginBottom="$3" padding="$4">
      <YStack space="$3">
        <XStack alignItems="flex-start" justifyContent="space-between">
          <YStack flex={1} space="$2">
            <Text color="$textPrimary" fontSize="$5" fontWeight="600">
              {memo.title}
            </Text>
            <Text color="$textSecondary" fontSize="$3" lineHeight="$1">
              {memo.content}
            </Text>
          </YStack>
        </XStack>

        <XStack alignItems="center" justifyContent="space-between">
          <YStack space="$1">
            <Text color="$textSecondary" fontSize="$2">
              알림 예정: {formatReminderDate(memo.reminderDate)}
            </Text>
            <XStack alignItems="center" space="$2">
              <View backgroundColor={statusColor} borderRadius="$10" height="$0.5" width="$0.5" />
              <Text color={statusColor} fontSize="$1">
                {statusText}
              </Text>
            </XStack>
          </YStack>

          <XStack space="$2">
            {memo.notificationId && !memo.isNotified && (
              <Button
                disabled={isLoading}
                size="sm"
                variant="outlined"
                onPress={handleCancelNotification}
              >
                {isLoading ? '취소 중...' : '알림 취소'}
              </Button>
            )}
            {onDelete && (
              <Button color="$red10" size="sm" variant="outlined" onPress={() => onDelete(memo.id)}>
                삭제
              </Button>
            )}
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
