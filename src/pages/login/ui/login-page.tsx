import { XStack, YStack } from 'tamagui';
import { AppleButton, GoogleButton } from '~/features/auth/ui';
import { EXTERNAL_LINKS } from '~/shared/config';
import { Checkbox, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Linking, Platform } from 'react-native';

import { ExternalLink } from '@tamagui/lucide-icons';

export function LoginPage() {
  const [agreed, setAgreed] = useState(false);

  const handlePrivacyPress = () => {
    Linking.openURL(EXTERNAL_LINKS.PRIVACY_POLICY);
  };

  return (
    <YStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      flex={1}
      gap="$8"
      justifyContent="center"
      padding="$5"
    >
      <Typography variant="largeTitle">Noturi</Typography>

      <XStack gap="$6" marginBottom="$10" opacity={agreed ? 1 : 0.5}>
        <GoogleButton disabled={!agreed} />
        {Platform.OS === 'ios' && <AppleButton disabled={!agreed} />}
      </XStack>

      <XStack alignItems="center" gap="$3">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} />
        <XStack alignItems="center" gap="$1">
          <XStack alignItems="center" gap="$1" onPress={handlePrivacyPress}>
            <Typography color="$blue10" variant="footnote">
              개인정보처리방침
            </Typography>
            <ExternalLink color="$blue10" size={12} />
          </XStack>
          <Typography color="$textSecondary" variant="footnote">
            에 동의합니다
          </Typography>
        </XStack>
      </XStack>
    </YStack>
  );
}
