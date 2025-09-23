import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import { NotificationMemo } from '~/entities/memo/model/types';
import { NotificationService } from '~/features/notification';
import { Screen } from '~/shared/ui/Layout';
import { CreateNotificationMemoForm, NotificationMemoCard } from '~/widgets/NotificationMemo';

import { useState } from 'react';

export default function NotificationTestScreen() {
  const [memos, setMemos] = useState<NotificationMemo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleMemoCreated = (memo: NotificationMemo) => {
    setMemos((prev) => [memo, ...prev]);
    setShowCreateForm(false);
  };

  const handleMemoUpdate = (updatedMemo: NotificationMemo) => {
    setMemos((prev) => prev.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo)));
  };

  const handleMemoDelete = (id: string) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  const handleTestNotification = async () => {
    try {
      await NotificationService.scheduleNotification({
        title: '테스트 알림',
        body: '이것은 5초 후 오는 테스트 알림입니다!',
        trigger: new Date(Date.now() + 5000), // 5초 후
      });
      alert('5초 후 테스트 알림이 올 예정입니다!');
    } catch (error) {
      console.error('테스트 알림 실패:', error);
      alert('테스트 알림 설정에 실패했습니다.');
    }
  };

  const handleViewScheduledNotifications = async () => {
    try {
      const scheduled = await NotificationService.getScheduledNotifications();
      alert(`예약된 알림 개수: ${scheduled.length}개`);
      console.log('예약된 알림들:', scheduled);
    } catch (error) {
      console.error('예약된 알림 조회 실패:', error);
    }
  };

  return (
    <Screen>
      <ScrollView flex={1} padding="$4">
        <YStack space="$4">
          <XStack alignItems="center" justifyContent="space-between">
            <Text color="$textPrimary" fontSize="$7" fontWeight="bold">
              🔔 알림 메모 테스트
            </Text>
            <Button size="sm" variant="outlined" onPress={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? '폼 숨기기' : '새 알림 메모'}
            </Button>
          </XStack>

          <XStack flexWrap="wrap" space="$2">
            <Button size="sm" variant="outlined" onPress={handleTestNotification}>
              5초 후 테스트 알림
            </Button>
            <Button size="sm" variant="outlined" onPress={handleViewScheduledNotifications}>
              예약된 알림 확인
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onPress={NotificationService.cancelAllNotifications}
            >
              모든 알림 취소
            </Button>
          </XStack>

          {showCreateForm && (
            <CreateNotificationMemoForm
              onCancel={() => setShowCreateForm(false)}
              onSuccess={handleMemoCreated}
            />
          )}

          <YStack space="$3">
            <Text color="$textPrimary" fontSize="$5" fontWeight="600">
              알림 메모 목록 ({memos.length}개)
            </Text>
            {memos.length === 0 ? (
              <Text color="$textSecondary" fontSize="$4" paddingVertical="$6" textAlign="center">
                알림 메모가 없습니다.
                {'\n'}위의 "새 알림 메모" 버튼을 눌러서 첫 번째 알림 메모를 만들어보세요!
              </Text>
            ) : (
              memos.map((memo) => (
                <NotificationMemoCard
                  key={memo.id}
                  memo={memo}
                  onDelete={handleMemoDelete}
                  onUpdate={handleMemoUpdate}
                />
              ))
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </Screen>
  );
}
