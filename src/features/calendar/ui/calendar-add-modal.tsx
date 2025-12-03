import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { Form, Input, Select, Switch, Typography } from '~/shared/ui';
import { FloatingButton } from '~/widgets/floating-button';

import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  ALL_DAY_NOTIFICATION_OPTIONS,
  NOTIFICATION_OPTIONS,
} from '@/entities/calendar/model/constants';
import type { CreateCalendarMemoDto, NotifyBefore } from '@/entities/calendar/model/types';
import { CALENDAR_COLORS, CALENDAR_THEME } from '@/entities/calendar/ui/calendar-view/constants';
import { formatDate, formatTime } from '@/shared/lib/format';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
}

export function CalendarAddModal({ isOpen, onClose, onSubmit }: CalendarAddModalProps) {
  const titleRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [isAllDay, setIsAllDay] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);

  const notificationOptions = isAllDay ? ALL_DAY_NOTIFICATION_OPTIONS : NOTIFICATION_OPTIONS;

  const getFormData = (): CreateCalendarMemoDto => ({
    title: titleRef.current.trim(),
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    isAllDay,
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  });

  const handleSuccess = () => {
    handleClose();
  };

  const handleClose = () => {
    titleRef.current = '';
    inputRef.current?.clear();
    setStartDateTime(new Date());
    setEndDateTime(new Date(Date.now() + 60 * 60 * 1000));
    setIsAllDay(false);
    setNotifyBefore(undefined);
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
                    setNotifyBefore(undefined); // 알림 옵션 초기화
                  }}
                />

                <YStack gap="$4">
                  <YStack gap="$2">
                    <Typography variant="footnote">시작</Typography>
                    <XStack gap="$3">
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() => {
                          setShowStartTimePicker(false);
                          setShowEndDatePicker(false);
                          setShowEndTimePicker(false);
                          setShowStartDatePicker(!showStartDatePicker);
                        }}
                      >
                        <Text
                          backgroundColor="$surface"
                          borderColor="$border"
                          borderRadius="$5"
                          borderWidth={1}
                          color="$textPrimary"
                          fontSize="$4"
                          height={44}
                          lineHeight={42}
                          textAlign="center"
                        >
                          {formatDate(startDateTime)}
                        </Text>
                      </Pressable>

                      {!isAllDay && (
                        <Pressable
                          onPress={() => {
                            setShowStartDatePicker(false);
                            setShowEndDatePicker(false);
                            setShowEndTimePicker(false);
                            setShowStartTimePicker(!showStartTimePicker);
                          }}
                        >
                          <Text
                            backgroundColor="$surface"
                            borderColor="$border"
                            borderRadius="$5"
                            borderWidth={1}
                            color="$textPrimary"
                            fontSize="$4"
                            height={44}
                            lineHeight={42}
                            minWidth={80}
                            textAlign="center"
                          >
                            {formatTime(startDateTime)}
                          </Text>
                        </Pressable>
                      )}
                    </XStack>

                    {showStartDatePicker && (
                      <Animated.View
                        entering={FadeIn.delay(200)}
                        exiting={FadeOut}
                        layout={LinearTransition}
                      >
                        <View backgroundColor="$surface" borderRadius="$4" paddingTop="$3">
                          <Calendar
                            current={startDateTime.toISOString().split('T')[0]}
                            markedDates={{
                              [startDateTime.toISOString().split('T')[0]]: {
                                selected: true,
                                selectedColor: CALENDAR_COLORS.SELECTION,
                                selectedTextColor: '#ffffff',
                              },
                            }}
                            theme={CALENDAR_THEME}
                            onDayPress={(day) => {
                              const newDate = new Date(day.dateString);
                              newDate.setHours(startDateTime.getHours());
                              newDate.setMinutes(startDateTime.getMinutes());
                              setStartDateTime(newDate);

                              if (isAllDay) {
                                const newEndDate = new Date(day.dateString);
                                newEndDate.setHours(endDateTime.getHours());
                                newEndDate.setMinutes(endDateTime.getMinutes());
                                setEndDateTime(newEndDate);
                              }
                              setShowStartDatePicker(false);
                            }}
                          />
                        </View>
                      </Animated.View>
                    )}

                    {!isAllDay && showStartTimePicker && (
                      <Animated.View
                        entering={FadeIn.delay(200)}
                        exiting={FadeOut}
                        layout={LinearTransition}
                      >
                        <View paddingTop="$3">
                          <DateTimePicker
                            display="spinner"
                            mode="time"
                            value={startDateTime}
                            onChange={(_, selectedTime) => {
                              if (selectedTime) {
                                const newDateTime = new Date(startDateTime);
                                newDateTime.setHours(selectedTime.getHours());
                                newDateTime.setMinutes(selectedTime.getMinutes());
                                setStartDateTime(newDateTime);
                              }
                            }}
                          />
                        </View>
                      </Animated.View>
                    )}
                  </YStack>

                  {/* 종료 */}
                  <Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition}>
                    <YStack gap="$2">
                      <Typography variant="footnote">종료</Typography>
                      <XStack gap="$3">
                        {/* 종료 날짜 */}
                        <Pressable
                          style={{ flex: 1 }}
                          onPress={() => {
                            setShowStartDatePicker(false);
                            setShowStartTimePicker(false);
                            setShowEndTimePicker(false);
                            setShowEndDatePicker(!showEndDatePicker);
                          }}
                        >
                          <Text
                            backgroundColor="$surface"
                            borderColor="$border"
                            borderRadius="$5"
                            borderWidth={1}
                            color="$textPrimary"
                            fontSize="$4"
                            height={44}
                            lineHeight={42}
                            textAlign="center"
                          >
                            {formatDate(endDateTime)}
                          </Text>
                        </Pressable>

                        {!isAllDay && (
                          <Pressable
                            onPress={() => {
                              setShowStartDatePicker(false);
                              setShowStartTimePicker(false);
                              setShowEndDatePicker(false);
                              setShowEndTimePicker(!showEndTimePicker);
                            }}
                          >
                            <Text
                              backgroundColor="$surface"
                              borderColor="$border"
                              borderRadius="$5"
                              borderWidth={1}
                              color="$textPrimary"
                              fontSize="$4"
                              height={44}
                              lineHeight={42}
                              minWidth={80}
                              textAlign="center"
                            >
                              {formatTime(endDateTime)}
                            </Text>
                          </Pressable>
                        )}
                      </XStack>

                      {/* 종료 날짜 캘린더 - 인라인 */}
                      {showEndDatePicker && (
                        <Animated.View
                          entering={FadeIn.delay(200)}
                          exiting={FadeOut}
                          layout={LinearTransition}
                        >
                          <View backgroundColor="$surface" borderRadius="$4" paddingTop="$3">
                            <Calendar
                              current={endDateTime.toISOString().split('T')[0]}
                              markedDates={{
                                [endDateTime.toISOString().split('T')[0]]: {
                                  selected: true,
                                  selectedColor: CALENDAR_COLORS.SELECTION,
                                  selectedTextColor: '#ffffff',
                                },
                              }}
                              minDate={
                                isAllDay ? undefined : startDateTime.toISOString().split('T')[0]
                              }
                              theme={CALENDAR_THEME}
                              onDayPress={(day) => {
                                const newDate = new Date(day.dateString);
                                newDate.setHours(endDateTime.getHours());
                                newDate.setMinutes(endDateTime.getMinutes());
                                setEndDateTime(newDate);

                                if (isAllDay) {
                                  const newStartDate = new Date(day.dateString);
                                  newStartDate.setHours(startDateTime.getHours());
                                  newStartDate.setMinutes(startDateTime.getMinutes());
                                  setStartDateTime(newStartDate);
                                }
                                setShowEndDatePicker(false);
                              }}
                            />
                          </View>
                        </Animated.View>
                      )}

                      {!isAllDay && showEndTimePicker && (
                        <Animated.View
                          entering={FadeIn}
                          exiting={FadeOut}
                          layout={LinearTransition}
                        >
                          <View paddingTop="$3">
                            <DateTimePicker
                              display="spinner"
                              mode="time"
                              value={endDateTime}
                              onChange={(_, selectedTime) => {
                                if (selectedTime) {
                                  const newDateTime = new Date(endDateTime);
                                  newDateTime.setHours(selectedTime.getHours());
                                  newDateTime.setMinutes(selectedTime.getMinutes());
                                  setEndDateTime(newDateTime);
                                }
                              }}
                            />
                          </View>
                        </Animated.View>
                      )}
                    </YStack>
                  </Animated.View>
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
