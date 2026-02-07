import { format } from 'date-fns';
import { todoMonthlyStatsQuery } from '~/entities/todo';
import { formatDateString, formatDateWithDay } from '~/entities/todo/lib/date-utils';
import { QuickTodoInput, TodoList } from '~/features/todo';
import { CircularProgress, FloatingButton, Typography } from '~/shared/ui';
import { TodoWeeklyView } from '~/widgets/todo-weekly-view';

import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

export function TodoPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const { data: monthlyStats } = useQuery(todoMonthlyStatsQuery({ year, month }));

  const selectedDateProgress = (() => {
    if (!monthlyStats?.dailyStats) return 0;
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const stat = monthlyStats.dailyStats.find((s) => s.date === dateString);
    return stat?.rate ?? 0;
  })();

  const handleFloatingButtonPress = () => {
    router.push({
      pathname: '/todo/create',
      params: { date: formatDateString(selectedDate) },
    });
  };

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
          <View className="flex-row items-center justify-between rounded-3 bg-surface px-4 py-3">
            <View>
              <Typography variant="headline" weight="semibold">
                {formatDateWithDay(selectedDate)}
              </Typography>
              <Typography className="mt-0.5 text-text-secondary" variant="footnote">
                {selectedDateProgress > 0
                  ? `${Math.round(selectedDateProgress)}% 완료`
                  : '할 일을 추가해보세요'}
              </Typography>
            </View>
            <CircularProgress progress={selectedDateProgress} size={48} strokeWidth={4}>
              <Typography className="text-primary" variant="callout" weight="bold">
                {Math.round(selectedDateProgress)}%
              </Typography>
            </CircularProgress>
          </View>

          <QuickTodoInput selectedDate={selectedDate} />
          <TodoList selectedDate={selectedDate} />
        </View>
      </ScrollView>

      <FloatingButton
        className="absolute bottom-[120px] right-4"
        onPress={handleFloatingButtonPress}
      />
    </View>
  );
}
