import { useState, useEffect } from 'react';
import { YStack, Text, Button } from 'tamagui';
import { NotificationMemo } from '~/entities/memo/model/types';
import { NotificationMemoCard, CreateNotificationMemoForm } from '~/widgets/NotificationMemo';

interface MemoNotificationViewProps {
  isPending: boolean;
  isError: boolean;
}

export function MemoNotificationView({ isPending, isError }: MemoNotificationViewProps) {
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

  if (isPending) {
    return (
      <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
        <Text fontSize="$4" color="$textSecondary">
          알림 메모를 불러오는 중...
        </Text>
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
        <Text fontSize="$4" color="$red10">
          알림 메모를 불러오는데 실패했습니다.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack space="$4">
      <YStack alignItems="center" paddingVertical="$4">
        <Button
          onPress={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
        >
          {showCreateForm ? '폼 숨기기' : '🔔 새 알림 메모 만들기'}
        </Button>
      </YStack>

      {showCreateForm && (
        <CreateNotificationMemoForm
          onSuccess={handleMemoCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <YStack space="$3">
        {memos.length === 0 ? (
          <YStack alignItems="center" paddingVertical="$8">
            <Text fontSize="$4" color="$textSecondary" textAlign="center">
              아직 알림 메모가 없습니다.
              {'\n'}위의 버튼을 눌러서 첫 번째 알림 메모를 만들어보세요!
            </Text>
          </YStack>
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
  );
}