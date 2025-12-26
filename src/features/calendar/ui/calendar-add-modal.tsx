import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { toast } from 'sonner-native';
import {
  ALL_DAY_NOTIFICATION_OPTIONS,
  NOTIFICATION_OPTIONS,
} from '~/entities/calendar/model/constants';
import type { CreateCalendarMemoDto, NotifyBefore } from '~/entities/calendar/model/types';
import { useUserTheme } from '~/features/theme';
import { formatDateTimeForApi, getHoursLater } from '~/shared/lib/format';
import { FloatingButton, Form, Input, Select, Switch, Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { DateTimePickerField } from './date-time-picker-field';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
}

export function CalendarAddModal({ isOpen, onClose, onSubmit }: CalendarAddModalProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const titleRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(getHoursLater(1));
  const [isAllDay, setIsAllDay] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);

  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['90%'], []);
  const notificationOptions = isAllDay ? ALL_DAY_NOTIFICATION_OPTIONS : NOTIFICATION_OPTIONS;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

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

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: hexColors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderColor: hexColors.border,
        borderBottomWidth: 0,
      }}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      snapPoints={snapPoints}
      onDismiss={handleClose}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View className="gap-4 p-4 pb-6">
          <Typography className="text-center" variant="headline">
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

            <View className="gap-4">
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
            </View>

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
        </View>
      </BottomSheetScrollView>

      <View className="absolute bottom-36 left-0 right-0 items-end px-6" style={{ zIndex: 5 }}>
        <FloatingButton
          onPress={() => {
            if (titleRef.current.trim()) {
              onSubmit(getFormData());
              handleSuccess();
            }
          }}
        />
      </View>
    </BottomSheetModal>
  );
}
