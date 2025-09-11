import { useState } from 'react';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Input } from '~/shared/ui/Input';
import { TextArea } from '~/shared/ui/TextArea';
import { Card } from '~/shared/ui/Card';
import { CreateNotificationMemoDto } from '~/entities/memo/model/types';
import { NotificationService } from '~/features/notification';
import { useNotifications } from '~/shared/hooks/useNotifications';

interface CreateNotificationMemoFormProps {
  onSuccess?: (memo: any) => void;
  onCancel?: () => void;
}

export function CreateNotificationMemoForm({ onSuccess, onCancel }: CreateNotificationMemoFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scheduleNotificationAsync } = useNotifications();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !reminderTime.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const reminderDate = new Date();
    const minutes = parseInt(reminderTime);
    if (isNaN(minutes) || minutes < 1) {
      alert('올바른 시간을 입력해주세요 (분 단위)');
      return;
    }
    reminderDate.setMinutes(reminderDate.getMinutes() + minutes);

    setIsSubmitting(true);
    try {
      const memoData: CreateNotificationMemoDto = {
        title,
        content,
        categoryId: 'notification-category',
        reminderDate,
      };

      const memo = await NotificationService.createNotificationMemo(memoData);
      
      // 로컬 알림 스케줄링
      await scheduleNotificationAsync({
        content: {
          title: `🔔 ${title}`,
          body: content,
        },
        trigger: reminderDate,
      });

      if (onSuccess) {
        onSuccess(memo);
      }

      // 폼 초기화
      setTitle('');
      setContent('');
      setReminderTime('');
    } catch (error) {
      console.error('알림 메모 생성 실패:', error);
      alert('알림 메모 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="$4">
      <YStack space="$4">
        <Text fontSize="$6" fontWeight="600" color="$textPrimary">
          🔔 알림 메모 만들기
        </Text>
        
        <YStack space="$3">
          <YStack space="$2">
            <Text fontSize="$3" fontWeight="500" color="$textPrimary">
              제목
            </Text>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="알림 메모 제목을 입력하세요"
            />
          </YStack>

          <YStack space="$2">
            <Text fontSize="$3" fontWeight="500" color="$textPrimary">
              내용
            </Text>
            <TextArea
              value={content}
              onChangeText={setContent}
              placeholder="알림 내용을 입력하세요"
              numberOfLines={3}
            />
          </YStack>

          <YStack space="$2">
            <Text fontSize="$3" fontWeight="500" color="$textPrimary">
              알림 시간 (분 후)
            </Text>
            <Input
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="예: 30 (30분 후 알림)"
              keyboardType="numeric"
            />
          </YStack>
        </YStack>

        <XStack space="$3" justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="ghost"
              onPress={onCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
          )}
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '알림 메모 생성'}
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}