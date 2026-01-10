import type { CalendarMemo } from '~/entities/calendar';
import { NOTIFICATION_LABELS } from '~/entities/calendar/model/constants';
import { CalendarMemoDeleteButton } from '~/features/calendar/ui/calendar-memo-delete-button';
import { formatTime } from '~/shared/lib';
import { Bell } from '~/shared/lib/icons';
import { Card, Typography } from '~/shared/ui';

import { View } from 'react-native';

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
    <Card>
      <View className="flex-row items-center justify-between p-1">
        <View className="flex-1 gap-1">
          <Typography className="text-text-primary" numberOfLines={1} variant="callout">
            {memo.title}
          </Typography>
          <View className="flex-row items-center gap-2">
            <Typography className="text-text-muted" variant="caption2">
              {timeText}
            </Typography>
            {memo.hasNotification && memo.notifyBefore && (
              <View className="flex-row items-center gap-1 rounded-2 bg-accent-soft px-2 py-0.5">
                <Bell className="text-accent" size={10} />
                <Typography className="text-accent-soft-text" variant="caption2">
                  {NOTIFICATION_LABELS[memo.notifyBefore]}
                </Typography>
              </View>
            )}
          </View>
        </View>

        <CalendarMemoDeleteButton memoId={memo.id} />
      </View>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <Typography className="text-text-muted text-center" variant="footnote">
      {message}
    </Typography>
  </Card>
);

const ErrorState = () => (
  <Card>
    <Typography className="text-text-muted text-center">일정을 불러오는데 실패했습니다.</Typography>
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
    <View className="gap-2">
      {memos.map((memo) => (
        <MemoCard key={memo.id} memo={memo} />
      ))}
    </View>
  );
}
