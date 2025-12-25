import { router } from 'expo-router';
import { View } from 'react-native';

import { MemoFormContent } from '~/features/memo/ui/memo-form-content';

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
