import { XStack, YStack } from 'tamagui';
import type { CalendarMemo } from '~/entities/calendar';
import { NOTIFICATION_LABELS } from '~/entities/calendar/model/constants';
import { CalendarMemoDeleteButton } from '~/features/calendar/ui/calendar-memo-delete-button';
import { formatTime } from '~/shared/lib';
import { Card, Typography } from '~/shared/ui';

import { Bell } from '@tamagui/lucide-icons';

interface CalendarMemoListProps {
  startDate: string;
  endDate: string;
  memos: CalendarMemo[];
  isLoading: boolean;
  isError: boolean;
}

const MemoCard = ({ memo }: { memo: CalendarMemo }) => {
  const timeText = memo.isAllDay
    ? '하루종일'
    : `${formatTime(memo.startDate)} - ${formatTime(memo.endDate)}`;

  return (
    <Card position="relative">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" flex={1} gap="$3">
          <YStack
            backgroundColor={memo.hasNotification ? '$blue10' : '$textMuted'}
            borderRadius="$1"
            height={36}
            width={3}
          />
          <YStack flex={1} gap="$0.5">
            <Typography color="$textPrimary" numberOfLines={1} variant="callout">
              {memo.title}
            </Typography>
            <XStack alignItems="center" gap="$2">
              <Typography color="$textMuted" variant="caption2">
                {timeText}
              </Typography>
              {memo.hasNotification && memo.notifyBefore && (
                <XStack alignItems="center" gap="$1">
                  <Bell color="$blue10" size={10} />
                  <Typography color="$blue10" variant="caption2">
                    {NOTIFICATION_LABELS[memo.notifyBefore]}
                  </Typography>
                </XStack>
              )}
            </XStack>
          </YStack>
        </XStack>

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
