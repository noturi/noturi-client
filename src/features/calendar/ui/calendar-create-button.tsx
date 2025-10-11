import { CreateCalendarMemoDto } from '~/entities/calendar-memo/model/types';
import { SubmitButton } from '~/shared/ui';

import type { ComponentProps } from 'react';

import { useCreateCalendarMemo } from '../api/mutations';

interface CalendarCreateButtonProps
  extends Omit<ComponentProps<typeof SubmitButton>, 'onPress' | 'isLoading'> {
  data: CreateCalendarMemoDto;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function CalendarCreateButton({
  disabled,
  data,
  onSuccess,
  onError,
  children = '추가',
  ...props
}: CalendarCreateButtonProps) {
  const createCalendarMemoMutation = useCreateCalendarMemo();

  const handlePress = async () => {
    try {
      await createCalendarMemoMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
      console.error('캘린더 메모 생성 실패:', error);
    }
  };

  const isFormValid = data.title.trim() && data.startDate;

  return (
    <SubmitButton
      disabled={disabled || !isFormValid}
      isLoading={createCalendarMemoMutation.isPending}
      onPress={handlePress}
      {...props}
    >
      {children}
    </SubmitButton>
  );
}
