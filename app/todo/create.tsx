import { TodoCreateForm } from '~/features/todo';

import { View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

export default function TodoCreateScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const initialDate = date ? new Date(date) : new Date();

  const handleSuccess = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-bg-secondary">
      <TodoCreateForm initialDate={initialDate} onSuccess={handleSuccess} />
    </View>
  );
}
