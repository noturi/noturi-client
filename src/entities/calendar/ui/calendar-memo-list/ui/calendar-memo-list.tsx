import { XStack, YStack } from 'tamagui';
import { CalendarMemoDeleteButton } from '~/features/calendar/ui/calendar-memo-delete-button';
import { Card, Typography } from '~/shared/ui';

import { Bell } from '@tamagui/lucide-icons';

import type { CalendarMemo } from '@/entities/calendar';
import type { NotifyBefore } from '@/entities/calendar/model/types';

interface CalendarMemoListProps {
  startDate: string;
  endDate: string;
  memos: CalendarMemo[];
  isLoading: boolean;
  isError: boolean;
}

const NOTIFICATION_LABELS: Record<NotifyBefore, string> = {
  FIVE_MINUTES_BEFORE: '5분 전',
  FIFTEEN_MINUTES_BEFORE: '15분 전',
  THIRTY_MINUTES_BEFORE: '30분 전',
  ONE_HOUR_BEFORE: '1시간 전',
  ONE_DAY_BEFORE: '1일 전',
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MemoCard = ({ memo }: { memo: CalendarMemo }) => {
  return (
    <Card position="relative">
      <XStack alignItems="flex-start" justifyContent="space-between">
        <YStack flex={1}>
          <Typography color="$textPrimary" variant="callout">
            {memo.title}
          </Typography>

          <Typography color="$textMuted" marginTop="$1" variant="caption2">
            {formatTime(memo.startDate)} - {formatTime(memo.endDate)}
          </Typography>

          {memo.hasNotification && memo.notifyBefore && (
            <XStack alignItems="center" gap="$1.5" marginTop="$1.5">
              <Bell color="$blue10" size={12} />
              <Typography color="$blue10" variant="caption2">
                {NOTIFICATION_LABELS[memo.notifyBefore]} 알림
              </Typography>
            </XStack>
          )}
        </YStack>

        <CalendarMemoDeleteButton memoId={memo.id} />
      </XStack>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <Typography color="$textMuted" textAlign="center" variant="footnote">
      {message}
    </Typography>
  </Card>
);

const ErrorState = () => (
  <Card>
    <Typography color="$textMuted" textAlign="center">
      일정을 불러오는데 실패했습니다.
    </Typography>
  </Card>
);

export function CalendarMemoList({ startDate, endDate, memos, isError }: CalendarMemoListProps) {
  if (!startDate) return null;

  if (isError) return <ErrorState />;

  if (memos.length === 0) {
    const message =
      startDate && endDate ? '선택한 기간에 일정이 없습니다.' : '선택한 날짜에 일정이 없습니다.';
    return <EmptyState message={message} />;
  }

  return (
    <YStack gap="$2">
      {memos.map((memo) => (
        <MemoCard key={memo.id} memo={memo} />
      ))}
    </YStack>
  );
}
