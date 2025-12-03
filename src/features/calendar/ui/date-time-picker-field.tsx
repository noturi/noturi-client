import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, XStack, YStack } from 'tamagui';
import { CALENDAR_COLORS, CALENDAR_THEME } from '~/entities/calendar/ui/calendar-view/constants';
import { formatDate, formatTime } from '~/shared/lib/format';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface DateTimePickerFieldProps {
  label: string;
  dateTime: Date;
  onDateTimeChange: (date: Date) => void;
  isAllDay?: boolean;
  minDate?: string;
  // 하루종일일 때 다른 날짜도 같이 변경
  onSyncDate?: (date: Date) => void;
}

export function DateTimePickerField({
  label,
  dateTime,
  onDateTimeChange,
  isAllDay = false,
  minDate,
  onSyncDate,
}: DateTimePickerFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDatePress = () => {
    setShowTimePicker(false);
    setShowDatePicker(!showDatePicker);
  };

  const handleTimePress = () => {
    setShowDatePicker(false);
    setShowTimePicker(!showTimePicker);
  };

  const handleDayPress = (day: { dateString: string }) => {
    const newDate = new Date(day.dateString);
    newDate.setHours(dateTime.getHours());
    newDate.setMinutes(dateTime.getMinutes());
    onDateTimeChange(newDate);

    if (isAllDay && onSyncDate) {
      onSyncDate(newDate);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (_: unknown, selectedTime?: Date) => {
    if (selectedTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      onDateTimeChange(newDateTime);
    }
  };

  return (
    <YStack gap="$2">
      <Typography variant="footnote">{label}</Typography>
      <XStack gap="$3">
        <Pressable style={{ flex: 1 }} onPress={handleDatePress}>
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
            {formatDate(dateTime)}
          </Text>
        </Pressable>

        {!isAllDay && (
          <Pressable onPress={handleTimePress}>
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
              {formatTime(dateTime)}
            </Text>
          </Pressable>
        )}
      </XStack>

      {showDatePicker && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
          <View backgroundColor="$surface" borderRadius="$4" paddingTop="$3">
            <Calendar
              current={dateTime.toISOString().split('T')[0]}
              markedDates={{
                [dateTime.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: CALENDAR_COLORS.SELECTION,
                  selectedTextColor: '#ffffff',
                },
              }}
              minDate={minDate}
              theme={CALENDAR_THEME}
              onDayPress={handleDayPress}
            />
          </View>
        </Animated.View>
      )}

      {!isAllDay && showTimePicker && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
          <View paddingTop="$3">
            <DateTimePicker
              display="spinner"
              mode="time"
              value={dateTime}
              onChange={handleTimeChange}
            />
          </View>
        </Animated.View>
      )}
    </YStack>
  );
}
