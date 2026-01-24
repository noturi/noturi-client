import { WeekDateSelector, todoMonthlyStatsQuery } from '~/entities/todo';
import { Card } from '~/shared/ui';

import { useQuery } from '@tanstack/react-query';

interface TodoWeeklyViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function TodoWeeklyView({ selectedDate, onSelectDate }: TodoWeeklyViewProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const { data: monthlyStats } = useQuery(todoMonthlyStatsQuery({ year, month }));

  return (
    <Card>
      <WeekDateSelector
        dailyStats={monthlyStats?.dailyStats}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
    </Card>
  );
}
