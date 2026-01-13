import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useUserTheme } from '~/application/providers/theme-provider';
import { createCalendarTheme } from '~/shared/config';
import { formatDate, formatTime } from '~/shared/lib/format';
import { Typography } from '~/shared/ui';

import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

export type PickerType = 'date' | 'time' | null;
export type ActivePicker = 'start-date' | 'start-time' | 'end-date' | 'end-time' | null;

interface DateTimePickerFieldProps {
  label: string;
  dateTime: Date;
  onDateTimeChange: (date: Date) => void;
  isAllDay?: boolean;
  minDate?: string;
  onSyncDate?: (date: Date) => void;
  activePicker?: PickerType;
  onPickerChange?: (picker: PickerType) => void;
}

export function DateTimePickerField({
  label,
  dateTime,
  onDateTimeChange,
  isAllDay = false,
  minDate,
  onSyncDate,
  activePicker,
  onPickerChange,
}: DateTimePickerFieldProps) {
  const isControlled = activePicker !== undefined && onPickerChange !== undefined;
  const [internalPicker, setInternalPicker] = useState<PickerType>(null);

  const currentPicker = isControlled ? activePicker : internalPicker;
  const setPicker = isControlled ? onPickerChange : setInternalPicker;

  const { hexColors } = useUserTheme();
  const calendarTheme = useMemo(() => createCalendarTheme(hexColors), [hexColors]);

  const handleDatePress = () => {
    setPicker(currentPicker === 'date' ? null : 'date');
  };

  const handleTimePress = () => {
    setPicker(currentPicker === 'time' ? null : 'time');
  };

  const handleDayPress = (day: { dateString: string }) => {
    const newDate = new Date(day.dateString);
    newDate.setHours(dateTime.getHours());
    newDate.setMinutes(dateTime.getMinutes());
    onDateTimeChange(newDate);

    if (isAllDay && onSyncDate) {
      onSyncDate(newDate);
    }
    setPicker(null);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    // Android에서는 확인/취소 시 picker를 닫아야 함
    if (Platform.OS === 'android') {
      setPicker(null);
    }

    if (event.type === 'set' && selectedTime) {
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
        <Pressable className="flex-1" onPress={handleDatePress}>
          <Text
            className="rounded-5 border border-border bg-surface text-center text-text-primary"
            style={{ height: 44, lineHeight: 42, fontSize: 16 }}
          >
            {formatDate(dateTime)}
          </Text>
        </Pressable>

        {!isAllDay && (
          <Pressable onPress={handleTimePress}>
            <Text
              className="min-w-[80px] rounded-5 border border-border bg-surface text-center text-text-primary"
              style={{ height: 44, lineHeight: 42, fontSize: 16 }}
            >
              {formatTime(dateTime)}
            </Text>
          </Pressable>
        )}
      </View>

      {currentPicker === 'date' && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
          <View className="rounded-4 pt-3" style={{ backgroundColor: hexColors.surface }}>
            <Calendar
              key={hexColors.bgPrimary}
              current={dateTime.toISOString().split('T')[0]}
              monthFormat="yyyy년 MM월"
              markedDates={{
                [dateTime.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: hexColors.primary,
                  selectedTextColor: hexColors.primaryText,
                },
              }}
              minDate={minDate}
              theme={calendarTheme}
              onDayPress={handleDayPress}
            />
          </View>
        </Animated.View>
      )}

      {!isAllDay && currentPicker === 'time' && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut} layout={LinearTransition}>
          <View className="pt-3">
            <DateTimePicker
              display="spinner"
              mode="time"
              textColor={hexColors.textPrimary}
              value={dateTime}
              onChange={handleTimeChange}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
