import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { toast } from 'sonner-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import {
  ALL_DAY_NOTIFICATION_OPTIONS,
  NOTIFICATION_OPTIONS,
} from '~/entities/calendar/model/constants';
import type {
  CalendarMemo,
  CreateCalendarMemoDto,
  NotifyBefore,
  UpdateCalendarMemoDto,
} from '~/entities/calendar/model/types';
import { formatDateTimeForApi, getHoursLater } from '~/shared/lib/format';
import { FloatingButton, Form, Input, Select, Switch, Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ActivePicker, DateTimePickerField, PickerType } from './date-time-picker-field';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
  onUpdate?: (data: UpdateCalendarMemoDto) => void;
  editData?: CalendarMemo | null;
  initialStartDate?: string;
  initialEndDate?: string;
}

export function CalendarAddModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editData,
  initialStartDate,
  initialEndDate,
}: CalendarAddModalProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const titleRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(getHoursLater(1));
  const [isAllDay, setIsAllDay] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const isEditMode = !!editData;
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['85%'], []);
  const notificationOptions = isAllDay ? ALL_DAY_NOTIFICATION_OPTIONS : NOTIFICATION_OPTIONS;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();

      // 수정 모드일 때 기존 데이터로 폼 초기화
      if (editData) {
        titleRef.current = editData.title;
        inputRef.current?.setNativeProps({ text: editData.title });
        setStartDateTime(new Date(editData.startDate));
        setEndDateTime(new Date(editData.endDate));
        setIsAllDay(editData.isAllDay);
        setNotifyBefore(editData.hasNotification ? editData.notifyBefore : undefined);
      } else if (initialStartDate) {
        // 생성 모드일 때 선택된 날짜로 초기화
        const startDate = new Date(initialStartDate);
        startDate.setHours(new Date().getHours() + 1, 0, 0, 0);
        setStartDateTime(startDate);

        if (initialEndDate) {
          // 기간 선택된 경우
          const endDate = new Date(initialEndDate);
          endDate.setHours(startDate.getHours() + 1, 0, 0, 0);
          setEndDateTime(endDate);
        } else {
          // 단일 날짜 선택된 경우
          const endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + 1);
          setEndDateTime(endDate);
        }
      }
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen, editData, initialStartDate, initialEndDate]);

  const resetForm = () => {
    titleRef.current = '';
    inputRef.current?.clear();
    setStartDateTime(new Date());
    setEndDateTime(getHoursLater(1));
    setIsAllDay(false);
    setNotifyBefore(undefined);
    setActivePicker(null);
  };

  const getFormData = (): CreateCalendarMemoDto => ({
    title: titleRef.current.trim(),
    startDate: formatDateTimeForApi(startDateTime),
    endDate: formatDateTimeForApi(endDateTime),
    isAllDay,
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  });

  const getUpdateFormData = (): UpdateCalendarMemoDto => ({
    id: editData!.id,
    title: titleRef.current.trim(),
    startDate: formatDateTimeForApi(startDateTime),
    endDate: formatDateTimeForApi(endDateTime),
    isAllDay,
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  });

  const handleSuccess = () => {
    toast.success(isEditMode ? '일정이 수정되었습니다' : '일정이 추가되었습니다');
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
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: hexColors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderColor: hexColors.border,
        borderBottomWidth: 0,
      }}
      enableDynamicSizing={false}
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
            {isEditMode ? '일정 수정' : '새 일정'}
          </Typography>

          <Form>
            <Form.Field required label="제목">
              <Input
                ref={inputRef}
                defaultValue={editData?.title}
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
                if (checked) {
                  // 하루종일일 때 종료일을 시작일과 같게 설정
                  const newEndDate = new Date(startDateTime);
                  newEndDate.setHours(startDateTime.getHours() + 1);
                  newEndDate.setMinutes(startDateTime.getMinutes());
                  setEndDateTime(newEndDate);
                }
              }}
            />

            <View className="gap-4">
              <DateTimePickerField
                activePicker={
                  activePicker === 'start-date'
                    ? 'date'
                    : activePicker === 'start-time'
                      ? 'time'
                      : null
                }
                dateTime={startDateTime}
                isAllDay={isAllDay}
                label="시작"
                onDateTimeChange={setStartDateTime}
                onPickerChange={(picker: PickerType) => {
                  if (picker === 'date') setActivePicker('start-date');
                  else if (picker === 'time') setActivePicker('start-time');
                  else setActivePicker(null);
                }}
                onSyncDate={(date) => {
                  const newEndDate = new Date(date);
                  newEndDate.setHours(endDateTime.getHours());
                  newEndDate.setMinutes(endDateTime.getMinutes());
                  setEndDateTime(newEndDate);
                }}
              />

              <DateTimePickerField
                activePicker={
                  activePicker === 'end-date' ? 'date' : activePicker === 'end-time' ? 'time' : null
                }
                dateTime={endDateTime}
                isAllDay={isAllDay}
                label="종료"
                minDate={isAllDay ? undefined : startDateTime.toISOString().split('T')[0]}
                onDateTimeChange={setEndDateTime}
                onPickerChange={(picker: PickerType) => {
                  if (picker === 'date') setActivePicker('end-date');
                  else if (picker === 'time') setActivePicker('end-time');
                  else setActivePicker(null);
                }}
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
              if (isEditMode && onUpdate) {
                onUpdate(getUpdateFormData());
              } else {
                onSubmit(getFormData());
              }
              handleSuccess();
            }
          }}
        />
      </View>
    </BottomSheetModal>
  );
}
