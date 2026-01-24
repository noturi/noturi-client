import { formatDateString } from '~/entities/todo/lib/date-utils';
import { QuickTodoInput, TodoList } from '~/features/todo';
import { FloatingButton } from '~/shared/ui';
import { TodoWeeklyView } from '~/widgets/todo-weekly-view';

import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

export function TodoPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

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
        <View className="gap-5 px-4 pt-4">
          <TodoWeeklyView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
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
