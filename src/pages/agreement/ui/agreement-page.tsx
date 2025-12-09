import { YStack } from 'tamagui';
import { EXTERNAL_LINKS, HREFS } from '~/shared/config';
import { Checkbox, Typography } from '~/shared/ui';
import { SubmitButton } from '~/widgets';

import { useState } from 'react';
import { Linking } from 'react-native';

import { router } from 'expo-router';

import { ExternalLink } from '@tamagui/lucide-icons';

export function AgreementPage() {
  const [agreed, setAgreed] = useState(false);

  const handlePrivacyPress = () => {
    Linking.openURL(EXTERNAL_LINKS.PRIVACY_POLICY);
  };

  const handleAgree = () => {
    // TODO: 서버에 동의 정보 전송 (필요한 경우)
    router.replace(HREFS.tabs());
  };

  return (
    <YStack
      backgroundColor="$backgroundPrimary"
      flex={1}
      justifyContent="space-between"
      padding="$5"
    >
      <YStack flex={1} gap="$6" justifyContent="center">
        <YStack gap="$2">
          <Typography variant="title1">서비스 이용을 위해</Typography>
          <Typography variant="title1">약관에 동의해주세요</Typography>
        </YStack>

        <YStack
          backgroundColor="$backgroundSecondary"
          borderRadius="$4"
          gap="$4"
          padding="$4"
        >
          <YStack
            alignItems="center"
            flexDirection="row"
            gap="$3"
            justifyContent="space-between"
            onPress={handlePrivacyPress}
          >
            <Typography color="$textPrimary" variant="body">
              개인정보처리방침
            </Typography>
            <ExternalLink color="$textMuted" size={16} />
          </YStack>
        </YStack>

        <YStack
          alignItems="center"
          flexDirection="row"
          gap="$3"
          onPress={() => setAgreed(!agreed)}
        >
          <Checkbox checked={agreed} onCheckedChange={setAgreed} />
          <Typography color="$textSecondary" variant="callout">
            위 약관에 모두 동의합니다
          </Typography>
        </YStack>
      </YStack>

      <SubmitButton disabled={!agreed} title="시작하기" onPress={handleAgree} />
    </YStack>
  );
}

