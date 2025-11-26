import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { CreateCalendarMemoDto, NotifyBefore } from '~/entities/calendar-memo/model/types';
import { FloatingButton, Form, Input, Select, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCalendarMemoDto) => void;
}

export function CalendarAddModal({ isOpen, onClose, onSubmit }: CalendarAddModalProps) {
  const [title, setTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<NotifyBefore | undefined>(undefined);

  // 포맷팅 헬퍼 함수들
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // 알림 옵션
  const getAvailableNotificationOptions = () => {
    const shortTermOptions = [
      { value: 'ONE_MINUTE_BEFORE', label: '1분 전' },
      { value: 'FIVE_MINUTES_BEFORE', label: '5분 전' },
      { value: 'TEN_MINUTES_BEFORE', label: '10분 전' },
      { value: 'FIFTEEN_MINUTES_BEFORE', label: '15분 전' },
      { value: 'THIRTY_MINUTES_BEFORE', label: '30분 전' },
      { value: 'ONE_HOUR_BEFORE', label: '1시간 전' },
    ];

    const longTermOptions = [
      { value: 'ONE_DAY_BEFORE', label: '1일 전' },
      { value: 'TWO_DAYS_BEFORE', label: '2일 전' },
    ];

    return { shortTermOptions, longTermOptions };
  };

  const { shortTermOptions, longTermOptions } = getAvailableNotificationOptions();

  const formData: CreateCalendarMemoDto = {
    title: title.trim(),
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    hasNotification: notifyBefore !== undefined,
    notifyBefore,
  };

  const handleSuccess = () => {
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setStartDateTime(new Date());
    setEndDateTime(new Date(Date.now() + 60 * 60 * 1000));
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
          backgroundColor="$backgroundSecondary"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
        >
          <YStack alignItems="center" paddingBottom="$2" paddingTop="$2">
            <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
          </YStack>

          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack gap="$4" padding="$4" paddingBottom="$6">
              <Typography textAlign="center" variant="headline">
                새 일정
              </Typography>

              <Form>
                <Form.Field required label="제목">
                  <Input
                    placeholder="일정 제목을 입력하세요"
                    size="lg"
                    value={title}
                    onChangeText={setTitle}
                  />
                </Form.Field>

                <YStack gap="$4">
                  <YStack gap="$2">
                    <Typography color="$textSecondary" variant="subheadline">
                      시작
                    </Typography>
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
                          borderRadius="$4"
                          color="$textPrimary"
                          fontSize="$4"
                          padding="$3"
                          textAlign="center"
                        >
                          {formatDate(startDateTime)}
                        </Text>
                      </Pressable>

                      {/* 시작 시간 */}
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
                          borderRadius="$4"
                          color="$textPrimary"
                          fontSize="$4"
                          minWidth={80}
                          padding="$3"
                          textAlign="center"
                        >
                          {formatTime(startDateTime)}
                        </Text>
                      </Pressable>
                    </XStack>

                    {/* 시작 날짜 DateTimePicker - 인라인 */}
                    {showStartDatePicker && (
                      <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
                        <View paddingTop="$3">
                          <DateTimePicker
                            display="spinner"
                            mode="date"
                            value={startDateTime}
                            onChange={(_, selectedDate) => {
                              if (selectedDate) {
                                setStartDateTime(selectedDate);
                              }
                            }}
                          />
                        </View>
                      </Animated.View>
                    )}

                    {/* 시작 시간 DateTimePicker - 인라인 */}
                    {showStartTimePicker && (
                      <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
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
                  <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                    <YStack gap="$2">
                      <Typography color="$textSecondary" variant="subheadline">
                        종료
                      </Typography>
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
                            borderRadius="$4"
                            color="$textPrimary"
                            fontSize="$4"
                            padding="$3"
                            textAlign="center"
                          >
                            {formatDate(endDateTime)}
                          </Text>
                        </Pressable>

                        {/* 종료 시간 */}
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
                            borderRadius="$4"
                            color="$textPrimary"
                            fontSize="$4"
                            minWidth={80}
                            padding="$3"
                            textAlign="center"
                          >
                            {formatTime(endDateTime)}
                          </Text>
                        </Pressable>
                      </XStack>

                      {/* 종료 날짜 DateTimePicker - 인라인 */}
                      {showEndDatePicker && (
                        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
                          <View paddingTop="$3">
                            <DateTimePicker
                              display="spinner"
                              mode="date"
                              value={endDateTime}
                              onChange={(_, selectedDate) => {
                                if (selectedDate) {
                                  setEndDateTime(selectedDate);
                                }
                              }}
                            />
                          </View>
                        </Animated.View>
                      )}

                      {/* 종료 시간 DateTimePicker - 인라인 */}
                      {showEndTimePicker && (
                        <Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition}>
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
                      options={(() => {
                        const allOptions = [
                          { value: 'NONE', label: '알림 안함' },
                          ...shortTermOptions,
                          ...longTermOptions,
                        ];
                        return allOptions;
                      })()}
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
              disabled={!title.trim()}
              onPress={() => {
                if (title.trim()) {
                  onSubmit(formData);
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
