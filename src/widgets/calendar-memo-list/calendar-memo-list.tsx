import type { CalendarMemo, UpdateCalendarMemoDto } from '~/entities/calendar';
import { NOTIFICATION_LABELS } from '~/entities/calendar/model/constants';
import { useUpdateCalendarMemo } from '~/features/calendar/api';
import { CalendarAddModal } from '~/features/calendar/ui/calendar-add-modal';
import { CalendarMemoDeleteButton } from '~/features/calendar/ui/calendar-memo-delete-button';
import { formatTime, useToast } from '~/shared/lib';
import { Bell } from '~/shared/lib/icons';
import { Card, Typography } from '~/shared/ui';

import { useMemo, useState } from 'react';
import { View } from 'react-native';

interface CalendarMemoListProps {
  startDate: string;
  endDate: string;
  memos: CalendarMemo[];
  isLoading: boolean;
  isError: boolean;
}

const MemoCard = ({
  memo,
  onEdit,
}: {
  memo: CalendarMemo;
  onEdit: (memo: CalendarMemo) => void;
}) => {
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

        <CalendarMemoDeleteButton memoId={memo.id} onEdit={() => onEdit(memo)} />
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

/**
 * 날짜 문자열을 한국어 형식으로 포맷합니다.
 */
function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

/**
 * 메모를 날짜별로 그룹핑합니다.
 */
function groupMemosByDate(memos: CalendarMemo[]): Map<string, CalendarMemo[]> {
  const grouped = new Map<string, CalendarMemo[]>();

  memos.forEach((memo) => {
    const dateKey = memo.startDate.split('T')[0]; // YYYY-MM-DD 형식
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, memo]);
  });

  // 날짜순 정렬
  return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function CalendarMemoList({ startDate, endDate, memos, isError }: CalendarMemoListProps) {
  const [editMemo, setEditMemo] = useState<CalendarMemo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  const updateMutation = useUpdateCalendarMemo({
    onSuccess: () => {
      setIsEditModalOpen(false);
      setEditMemo(null);
    },
    onError: () => {
      toast.showError('일정 수정에 실패했습니다.');
    },
  });

  const handleEdit = (memo: CalendarMemo) => {
    setEditMemo(memo);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (data: UpdateCalendarMemoDto) => {
    updateMutation.mutate(data);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditMemo(null);
  };

  if (!startDate) return null;

  if (isError) return <ErrorState />;

  const groupedMemos = useMemo(() => groupMemosByDate(memos), [memos]);

  if (memos.length === 0) {
    const message =
      startDate && endDate ? '선택한 기간에 일정이 없습니다.' : '선택한 날짜에 일정이 없습니다.';
    return <EmptyState message={message} />;
  }

  return (
    <>
      <View className="gap-4">
        {[...groupedMemos.entries()].map(([dateKey, dateMemos]) => (
          <View key={dateKey} className="gap-2">
            <Typography className="text-text-secondary" variant="footnote">
              {formatDateLabel(dateKey)}
            </Typography>
            <View className="gap-2">
              {dateMemos.map((memo) => (
                <MemoCard key={memo.id} memo={memo} onEdit={handleEdit} />
              ))}
            </View>
          </View>
        ))}
      </View>

      <CalendarAddModal
        editData={editMemo}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={() => {}}
        onUpdate={handleUpdate}
      />
    </>
  );
}
