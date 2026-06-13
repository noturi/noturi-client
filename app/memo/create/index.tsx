import { MemoForm } from '~/features/memo/ui';

import { View } from 'react-native';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 bg-bg-secondary">
      <MemoForm shouldAutoFocus={true} onSuccess={handleSuccess} />
    </View>
  );
}
