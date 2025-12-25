import { MemoFormContent } from '~/features/memo/ui/memo-form-content';

import { View } from 'react-native';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 bg-bg-secondary">
      <MemoFormContent shouldAutoFocus={true} onSuccess={handleSuccess} />
    </View>
  );
}
