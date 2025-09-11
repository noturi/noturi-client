import { useState } from 'react';
import { ScrollView, YStack, XStack, Text, Button } from 'tamagui';
import { Layout } from '~/shared/ui/Layout';
import { CreateNotificationMemoForm, NotificationMemoCard } from '~/widgets/NotificationMemo';
import { NotificationMemo } from '~/entities/memo/model/types';
import { NotificationService } from '~/features/notification';

export default function NotificationTestScreen() {
  const [memos, setMemos] = useState<NotificationMemo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleMemoCreated = (memo: NotificationMemo) => {
    setMemos(prev => [memo, ...prev]);
    setShowCreateForm(false);
  };

  const handleMemoUpdate = (updatedMemo: NotificationMemo) => {
    setMemos(prev => 
      prev.map(memo => 
        memo.id === updatedMemo.id ? updatedMemo : memo
      )
    );
  };

  const handleMemoDelete = (id: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== id));
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
    <Layout>
      <ScrollView flex={1} padding="$4">
        <YStack space="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$7" fontWeight="bold" color="$textPrimary">
              🔔 알림 메모 테스트
            </Text>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '폼 숨기기' : '새 알림 메모'}
            </Button>
          </XStack>

          <XStack space="$2" flexWrap="wrap">
            <Button
              size="sm"
              variant="ghost"
              onPress={handleTestNotification}
            >
              5초 후 테스트 알림
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onPress={handleViewScheduledNotifications}
            >
              예약된 알림 확인
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onPress={NotificationService.cancelAllNotifications}
            >
              모든 알림 취소
            </Button>
          </XStack>

          {showCreateForm && (
            <CreateNotificationMemoForm
              onSuccess={handleMemoCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          <YStack space="$3">
            <Text fontSize="$5" fontWeight="600" color="$textPrimary">
              알림 메모 목록 ({memos.length}개)
            </Text>
            {memos.length === 0 ? (
              <Text fontSize="$4" color="$textSecondary" textAlign="center" paddingVertical="$6">
                알림 메모가 없습니다.
                {'\n'}위의 "새 알림 메모" 버튼을 눌러서 첫 번째 알림 메모를 만들어보세요!
              </Text>
            ) : (
              memos.map(memo => (
                <NotificationMemoCard
                  key={memo.id}
                  memo={memo}
                  onUpdate={handleMemoUpdate}
                  onDelete={handleMemoDelete}
                />
              ))
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </Layout>
  );
}