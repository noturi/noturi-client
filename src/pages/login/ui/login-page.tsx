import { Platform, View } from 'react-native';

import { AppleButton, GoogleButton } from '~/features/auth/ui';
import { Typography } from '~/shared/ui';

export function LoginPage() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-primary gap-8 p-5">
      <Typography variant="largeTitle">Noturi</Typography>

      <View className="flex-row gap-6">
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleButton />}
      </View>
    </View>
  );
}
