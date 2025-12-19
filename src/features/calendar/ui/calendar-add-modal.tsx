import { toast } from 'sonner-native';
import { ScrollView, Sheet, View, YStack } from 'tamagui';
import {
  ALL_DAY_NOTIFICATION_OPTIONS,
  NOTIFICATION_OPTIONS,
} from '~/entities/calendar/model/constants';
import type { CreateCalendarMemoDto, NotifyBefore } from '~/entities/calendar/model/types';
import { formatDateTimeForApi, getHoursLater } from '~/shared/lib/format';
import { Form, Input, Select, Switch, Typography } from '~/shared/ui';
import { FloatingButton } from '~/shared/ui';

import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { DateTimePickerField } from './date-time-picker-field';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
}

export function CalendarAddModal({ isOpen, onClose, onSubmit }: CalendarAddModalProps) {
  const titleRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(getHoursLater(1));
  const [isAllDay, setIsAllDay] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);

  const notificationOptions = isAllDay ? ALL_DAY_NOTIFICATION_OPTIONS : NOTIFICATION_OPTIONS;

  const resetForm = () => {
    titleRef.current = '';
    inputRef.current?.clear();
    setStartDateTime(new Date());
    setEndDateTime(getHoursLater(1));
    setIsAllDay(false);
    setNotifyBefore(undefined);
  };

  const getFormData = (): CreateCalendarMemoDto => ({
    title: titleRef.current.trim(),
    startDate: formatDateTimeForApi(startDateTime),
    endDate: formatDateTimeForApi(endDateTime),
    isAllDay,
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  });

  const handleSuccess = () => {
    toast.success('일정이 추가되었습니다');
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Sheet
        dismissOnSnapToBottom
        modal
        animation="quick"
        open={isOpen}
        snapPoints={[90]}
        snapPointsMode="percent"
        zIndex={100000}
        onOpenChange={onClose}
      >
        <Sheet.Overlay
          animation="quick"
          backgroundColor="$backgroundOverlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          backgroundColor="$backgroundSecondary"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
        >
          <YStack alignItems="center" paddingBottom="$2" paddingTop="$2">
            <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
          </YStack>

          <ScrollView
            flex={1}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <YStack gap="$4" padding="$4" paddingBottom="$6">
              <Typography textAlign="center" variant="headline">
                새 일정
              </Typography>

              <Form>
                <Form.Field required label="제목">
                  <Input
                    ref={inputRef}
                    placeholder="일정 제목을 입력하세요"
                    size="lg"
                    onChangeText={(text) => {
                      titleRef.current = text;
                    }}
                  />
                </Form.Field>

                <Switch
                  checked={isAllDay}
                  label="하루종일"
                  onCheckedChange={(checked) => {
                    setIsAllDay(checked);
                    setNotifyBefore(undefined);
                  }}
                />

                <YStack gap="$4">
                  <DateTimePickerField
                    dateTime={startDateTime}
                    isAllDay={isAllDay}
                    label="시작"
                    onDateTimeChange={setStartDateTime}
                    onSyncDate={(date) => {
                      const newEndDate = new Date(date);
                      newEndDate.setHours(endDateTime.getHours());
                      newEndDate.setMinutes(endDateTime.getMinutes());
                      setEndDateTime(newEndDate);
                    }}
                  />

                  <DateTimePickerField
                    dateTime={endDateTime}
                    isAllDay={isAllDay}
                    label="종료"
                    minDate={isAllDay ? undefined : startDateTime.toISOString().split('T')[0]}
                    onDateTimeChange={setEndDateTime}
                    onSyncDate={(date) => {
                      const newStartDate = new Date(date);
                      newStartDate.setHours(startDateTime.getHours());
                      newStartDate.setMinutes(startDateTime.getMinutes());
                      setStartDateTime(newStartDate);
                    }}
                  />
                </YStack>

                <Animated.View layout={LinearTransition}>
                  <Form.Field label="알림 설정">
                    <Select
                      options={notificationOptions}
                      placeholder="알림 시점을 선택하세요"
                      value={notifyBefore || 'NONE'}
                      onValueChange={(value) => {
                        setNotifyBefore(value === 'NONE' ? undefined : (value as NotifyBefore));
                      }}
                    />
                  </Form.Field>
                </Animated.View>
              </Form>
            </YStack>
          </ScrollView>

          <View
            alignItems="flex-end"
            backgroundColor="transparent"
            bottom={140}
            left={0}
            paddingHorizontal={24}
            position="absolute"
            right={0}
            zIndex="$5"
          >
            <FloatingButton
              onPress={() => {
                if (titleRef.current.trim()) {
                  onSubmit(getFormData());
                  handleSuccess();
                }
              }}
            />
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
