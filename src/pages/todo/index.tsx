import { startOfDay } from 'date-fns';
import { useUserTheme } from '~/application/providers/theme-provider';
import { todosByDateQuery } from '~/entities/todo/api/queries';
import { formatDateString, formatDateWithDay } from '~/entities/todo/lib/date-utils';
import { QuickTodoInput, TodoList } from '~/features/todo';
import { CircularProgress, Typography } from '~/shared/ui';
import { TodoWeeklyView } from '~/widgets/todo-weekly-view';

import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useQuery } from '@tanstack/react-query';

export function TodoPage() {
  const { hexColors } = useUserTheme();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateString = formatDateString(selectedDate);
  const isPast = useMemo(() => startOfDay(selectedDate) < startOfDay(new Date()), [selectedDate]);
  const { data: todosData } = useQuery(todosByDateQuery(dateString));

  const selectedDateProgress = todosData?.rate ?? 0;

  // const handleFloatingButtonPress = () => {
  //   router.push({
  //     pathname: '/todo/create',
  //     params: { date: formatDateString(selectedDate) },
  //   });
  // };

  return (
    <View className="flex-1 bg-bg-secondary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 px-4 pt-4">
          <TodoWeeklyView selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {/* 선택된 날짜 및 진행률 */}
          <LinearGradient
            colors={[hexColors.primary, hexColors.textSecondary]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <View>
              <Typography className="!text-primary-text" variant="callout" weight="semibold">
                {formatDateWithDay(selectedDate)}
              </Typography>
              <Typography className="mt-0.5 !text-primary-text/60" variant="caption1">
                {selectedDateProgress > 0
                  ? `${Math.round(selectedDateProgress)}% 완료`
                  : '할 일을 추가해보세요'}
              </Typography>
            </View>
            <CircularProgress
              progress={selectedDateProgress}
              progressColor={hexColors.primaryText}
              size={48}
              strokeWidth={4}
              trackColor={`${hexColors.primaryText}30`}
            >
              <Typography className="!text-primary-text" variant="footnote" weight="bold">
                {Math.round(selectedDateProgress)}%
              </Typography>
            </CircularProgress>
          </LinearGradient>

          {!isPast && <QuickTodoInput selectedDate={selectedDate} />}
          <TodoList selectedDate={selectedDate} />
        </View>
      </ScrollView>

      {/* {!isPast && (
        <View className="absolute right-6" style={{ bottom: insets.bottom + 49 + 20 }}>
          <FloatingButton onPress={handleFloatingButtonPress} />
        </View>
      )} */}
    </View>
  );
}
