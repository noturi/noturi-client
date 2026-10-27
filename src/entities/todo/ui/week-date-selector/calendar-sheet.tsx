import { createCalendarTheme } from '~/shared/config/calendar-theme';
import { useUserTheme } from '~/shared/lib/theme-context';
import { ControlledSheet } from '~/shared/ui';

import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { formatDateString, parseDateString } from '../../lib/date-utils';

interface CalendarSheetProps {
  isOpen: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

/**
 * 월 헤더를 눌렀을 때 뜨는 월간 캘린더 바텀시트. 날짜를 고르면 선택 후 닫힌다
 */
export function CalendarSheet({ isOpen, selectedDate, onClose, onSelectDate }: CalendarSheetProps) {
  const { hexColors } = useUserTheme();

  const calendarTheme = {
    ...createCalendarTheme(hexColors),
    backgroundColor: hexColors.bgSecondary,
    calendarBackground: hexColors.bgSecondary,
  };

  const selectedDateString = formatDateString(selectedDate);

  const handleDayPress = (day: DateData) => {
    onSelectDate(parseDateString(day.dateString));
    onClose();
  };

  return (
    <ControlledSheet isOpen={isOpen} snapPoints={['48%']} onClose={onClose}>
      <View className="px-4 pb-4">
        <Calendar
          current={selectedDateString}
          markedDates={{
            [selectedDateString]: { selected: true },
          }}
          monthFormat="yyyy년 M월"
          theme={calendarTheme}
          onDayPress={handleDayPress}
        />
      </View>
    </ControlledSheet>
  );
}
