import { YStack } from 'tamagui';
import type { CalendarMemo } from '~/entities/calendar-memo';
import { Card, Typography } from '~/shared/ui';

interface CalendarMemoListProps {
  startDate: string;
  endDate: string;
  memos: CalendarMemo[];
  isLoading: boolean;
  isError: boolean;
}

export function CalendarMemoList({
  startDate,
  endDate,
  memos,
  isLoading,
  isError,
}: CalendarMemoListProps) {
  if (!startDate) return null;

  if (isError) {
    return (
      <Card>
        <Typography color="$textMuted" textAlign="center">
          일정을 불러오는데 실패했습니다.
        </Typography>
      </Card>
    );
  }

  if (memos.length > 0) {
    return (
      <YStack gap="$2">
        {memos.map((memo) => (
          <Card key={memo.id}>
            <Typography color="$textPrimary" variant="callout">
              {memo.title}
            </Typography>
            <Typography color="$textMuted" marginTop="$1" variant="caption2">
              {new Date(memo.startDate).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(memo.endDate).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            {memo.hasNotification && (
              <Typography color="$blue10" marginTop="$1" variant="caption2">
                🔔 알림 설정됨
              </Typography>
            )}
          </Card>
        ))}
      </YStack>
    );
  }

  const emptyMessage =
    startDate && endDate ? '선택한 기간에 일정이 없습니다.' : '선택한 날짜에 일정이 없습니다.';

  return (
    <Card>
      <Typography color="$textMuted" textAlign="center" variant="footnote">
        {emptyMessage}
      </Typography>
    </Card>
  );
}
