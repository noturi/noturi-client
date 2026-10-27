import { type DailyStat, WeekDateSelector } from '~/entities/todo';
import { Card } from '~/shared/ui';

interface TodoWeeklyViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dailyStats?: DailyStat[];
}

export function TodoWeeklyView({ selectedDate, onSelectDate, dailyStats }: TodoWeeklyViewProps) {
  return (
    <Card>
      <WeekDateSelector
        dailyStats={dailyStats}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
    </Card>
  );
}
