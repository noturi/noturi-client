import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { CALENDAR_COLORS, CALENDAR_THEME } from '~/shared/config';
import { formatDate, formatTime } from '~/shared/lib/format';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface DateTimePickerFieldProps {
  label: string;
  dateTime: Date;
  onDateTimeChange: (date: Date) => void;
  isAllDay?: boolean;
  minDate?: string;
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
  const { currentTheme } = useUserTheme();

  const surfaceColor = rgbToHex(currentTheme.colors.surface);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textColor = rgbToHex(currentTheme.colors.textPrimary);

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
    <View className="gap-2">
      <Typography variant="footnote">{label}</Typography>
      <View className="flex-row gap-3">
        <Pressable style={{ flex: 1 }} onPress={handleDatePress}>
          <Text
            className="h-11 rounded-5 text-center leading-[42px]"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
              borderWidth: 1,
              color: textColor,
              fontSize: 16,
            }}
          >
            {formatDate(dateTime)}
          </Text>
        </Pressable>

        {!isAllDay && (
          <Pressable onPress={handleTimePress}>
            <Text
              className="h-11 min-w-20 rounded-5 text-center leading-[42px]"
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                borderWidth: 1,
                color: textColor,
                fontSize: 16,
              }}
            >
              {formatTime(dateTime)}
            </Text>
          </Pressable>
        )}
      </View>

      {showDatePicker && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
          <View className="rounded-4 pt-3" style={{ backgroundColor: surfaceColor }}>
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
          <View className="pt-3">
            <DateTimePicker
              display="spinner"
              mode="time"
              value={dateTime}
              onChange={handleTimeChange}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
