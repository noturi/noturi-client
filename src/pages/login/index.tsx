import { AppleButton, GoogleButton } from '~/features/auth/ui';
import { Typography } from '~/shared/ui';

import { Image, Platform, View } from 'react-native';

const AppIcon = require('~/../assets/images/splash-icon.png');

export function LoginPage() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-primary gap-10 p-5">
      <View className="items-center gap-5">
        <Typography variant="largeTitle" weight="bold">
          Noturi
        </Typography>
        <Image className="h-36 w-36 rounded-5" source={AppIcon} />
      </View>

      <View className="flex-row gap-6">
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleButton />}
      </View>
    </View>
  );
}
