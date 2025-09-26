import { ScrollView, Sheet, Text, XStack, YStack } from 'tamagui';
import { CreateCalendarMemoDto, NotifyBefore } from '~/entities/calendar-memo/model/types';
import { useCalendarDate } from '~/shared/lib/calendar';
import { convertTo24Hour, timeSelectOptions } from '~/shared/lib/formatTime';
import { Form, Input, Select } from '~/shared/ui';

import { useState } from 'react';

import { CalendarCreateButton } from './CalendarCreateButton';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
}

export function CalendarAddModal({ isOpen, onClose, onSubmit }: CalendarAddModalProps) {
  const { startDate, endDate } = useCalendarDate();
  const [title, setTitle] = useState('');
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('00');
  const [endAmPm, setEndAmPm] = useState('AM');
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);

  console.log('CalendarAddModal 렌더, isOpen:', isOpen, 'startDate:', startDate);
  console.log('알림 설정 상태:', notifyBefore);

  const startTime = convertTo24Hour(startHour, startMinute, startAmPm);
  const endTime = convertTo24Hour(endHour, endMinute, endAmPm);

  const isSingleDayEvent = !endDate || endDate === startDate;
  const isPeriodEvent = !isSingleDayEvent;

  const getEventTime = () => {
    if (isPeriodEvent) {
      return {
        startTime: '00:00',
        endTime: '23:59',
      };
    }
    return {
      startTime: startTime,
      endTime: endTime,
    };
  };

  const { startTime: actualStartTime, endTime: actualEndTime } = getEventTime();

  // 비즈니스 규칙: 알림 옵션을 이벤트 타입에 따라 제한
  const getAvailableNotificationOptions = () => {
    if (isSingleDayEvent) {
      return {
        shortTermOptions: [
          { value: 'ONE_MINUTE_BEFORE', label: '1분 전' },
          { value: 'FIVE_MINUTES_BEFORE', label: '5분 전' },
          { value: 'TEN_MINUTES_BEFORE', label: '10분 전' },
          { value: 'FIFTEEN_MINUTES_BEFORE', label: '15분 전' },
          { value: 'THIRTY_MINUTES_BEFORE', label: '30분 전' },
          { value: 'ONE_HOUR_BEFORE', label: '1시간 전' },
          { value: 'TWO_HOURS_BEFORE', label: '2시간 전' },
          { value: 'THREE_HOURS_BEFORE', label: '3시간 전' },
        ],
        longTermOptions: [
          { value: 'ONE_DAY_BEFORE', label: '1일 전' },
          { value: 'TWO_DAYS_BEFORE', label: '2일 전' },
          { value: 'THREE_DAYS_BEFORE', label: '3일 전' },
        ],
      };
    } else {
      return {
        shortTermOptions: [],
        longTermOptions: [
          { value: 'ONE_DAY_BEFORE', label: '1일 전' },
          { value: 'TWO_DAYS_BEFORE', label: '2일 전' },
        ],
      };
    }
  };

  const { shortTermOptions, longTermOptions } = getAvailableNotificationOptions();

  console.log('알림 옵션들:', {
    isSingleDay: isSingleDayEvent,
    shortTerm: shortTermOptions,
    longTerm: longTermOptions,
  });

  // 시간 선택 옵션 (shared/lib 유틸리티 사용)
  const hourOptions = timeSelectOptions.getHourOptions();
  const minuteOptions = timeSelectOptions.getMinuteOptions();
  const amPmOptions = timeSelectOptions.getAmPmOptions();

  console.log('hourOptions:', hourOptions);
  console.log('minuteOptions:', minuteOptions);
  console.log('amPmOptions:', amPmOptions);

  const formData: CreateCalendarMemoDto = {
    title: title.trim(),
    startDate: `${startDate}T${actualStartTime}:00.000Z`,
    endDate: `${endDate || startDate}T${actualEndTime}:00.000Z`,
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  };

  console.log('formData 생성:', {
    title: formData.title,
    hasNotification: formData.hasNotification,
    notifyBefore: formData.notifyBefore,
  });

  const handleSuccess = () => {
    // onSubmit(formData); // CalendarCreateButton에서 이미 뮤테이션 실행됨
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setStartHour('09');
    setStartMinute('00');
    setStartAmPm('AM');
    setEndHour('10');
    setEndMinute('00');
    setEndAmPm('AM');
    setNotifyBefore(undefined);
    onClose();
  };

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={[80]}
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
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        <YStack alignItems="center" paddingBottom="$2" paddingTop="$2">
          <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
        </YStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack gap="$4" padding="$4" paddingBottom="$6">
            <Text color="$textPrimary" fontSize="$7" fontWeight="600" textAlign="center">
              새 일정 추가
            </Text>

            <Form>
              <Form.Field required label="제목">
                <Input
                  placeholder="일정 제목을 입력하세요"
                  size="lg"
                  value={title}
                  onChangeText={setTitle}
                />
              </Form.Field>

              <Form.Field label="선택한 기간">
                <YStack
                  backgroundColor="$backgroundSecondary"
                  borderRadius="$5"
                  justifyContent="center"
                  minHeight={44}
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                >
                  {startDate ? (
                    <YStack gap="$1">
                      <Text color="$textPrimary" fontSize="$4" fontWeight="500">
                        시작: {startDate}
                      </Text>
                      {endDate && endDate !== startDate && (
                        <Text color="$textPrimary" fontSize="$4" fontWeight="500">
                          종료: {endDate}
                        </Text>
                      )}
                      {(!endDate || endDate === startDate) && (
                        <Text color="$textMuted" fontSize="$3">
                          단일 날짜
                        </Text>
                      )}
                    </YStack>
                  ) : (
                    <Text color="$textMuted" fontSize="$4">
                      날짜를 선택해주세요
                    </Text>
                  )}
                </YStack>
              </Form.Field>

              {/* 비즈니스 규칙: 단일 날짜 이벤트만 시간 설정 가능 */}
              {isSingleDayEvent && (
                <YStack gap="$4">
                  {/* 시작 시간 */}
                  <Form.Field label="시작 시간">
                    <XStack gap="$2">
                      <Select
                        options={hourOptions}
                        placeholder="시"
                        value={startHour}
                        width="33%"
                        onValueChange={setStartHour}
                      />
                      <Select
                        options={minuteOptions}
                        placeholder="분"
                        value={startMinute}
                        width="33%"
                        onValueChange={setStartMinute}
                      />
                      <Select
                        options={amPmOptions}
                        placeholder="AM/PM"
                        value={startAmPm}
                        width="33%"
                        onValueChange={setStartAmPm}
                      />
                    </XStack>
                  </Form.Field>

                  {/* 종료 시간 */}
                  <Form.Field label="종료 시간">
                    <XStack gap="$2">
                      <Select
                        options={hourOptions}
                        placeholder="시"
                        value={endHour}
                        width="33%"
                        onValueChange={setEndHour}
                      />
                      <Select
                        options={minuteOptions}
                        placeholder="분"
                        value={endMinute}
                        width="33%"
                        onValueChange={setEndMinute}
                      />
                      <Select
                        options={amPmOptions}
                        placeholder="AM/PM"
                        value={endAmPm}
                        width="33%"
                        onValueChange={setEndAmPm}
                      />
                    </XStack>
                  </Form.Field>
                </YStack>
              )}

              {/* 비즈니스 규칙: 기간 이벤트는 하루 종일로 자동 설정 */}
              {isPeriodEvent && (
                <YStack
                  backgroundColor="$backgroundSecondary"
                  borderRadius="$5"
                  justifyContent="center"
                  minHeight={44}
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                >
                  <Text color="$textMuted" fontSize="$4" textAlign="center">
                    기간 선택 시 하루 종일 일정으로 설정됩니다
                  </Text>
                </YStack>
              )}

              <Form.Field label="알림 설정">
                <Select
                  options={(() => {
                    const allOptions = [
                      { value: 'NONE', label: '알림 안함' },
                      ...shortTermOptions,
                      ...longTermOptions,
                    ];
                    console.log('알림 설정 전체 옵션:', allOptions);
                    return allOptions;
                  })()}
                  placeholder="알림 시점을 선택하세요"
                  value={notifyBefore || 'NONE'}
                  onValueChange={(value) => {
                    console.log('알림 설정 변경:', value);
                    setNotifyBefore(value === 'NONE' ? undefined : (value as NotifyBefore));
                    console.log('변경 후 상태:', value === 'NONE' ? undefined : value);
                  }}
                />
              </Form.Field>
            </Form>
          </YStack>
        </ScrollView>

        {/* 하단 고정 버튼 영역 */}
        <YStack
          backgroundColor="$backgroundPrimary"
          borderTopColor="$borderColor"
          borderTopWidth={0.5}
          padding="$4"
          paddingBottom="$6"
        >
          <CalendarCreateButton data={formData} size="md" onSuccess={handleSuccess}>
            일정 추가
          </CalendarCreateButton>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
