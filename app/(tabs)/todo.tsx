import { TodoPage } from '~/pages/todo';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary" edges={['top']}>
      <TodoPage />
    </SafeAreaView>
  );
}
