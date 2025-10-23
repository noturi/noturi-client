import { XStack, YStack } from 'tamagui';
import { Card, Typography } from '~/shared/ui';

import { router } from 'expo-router';

import { FileText, Star } from '@tamagui/lucide-icons';

export default function MemoTypeSelectScreen() {
  const handleSelectRatingMemo = () => {
    router.push('/memo/create/rating');
  };

  const handleSelectTextMemo = () => {
    router.push('/memo/create/text');
  };

  return (
    <YStack backgroundColor="$backgroundSecondary" flex={1} gap="$4" padding="$4">
      <Typography color="$textPrimary" textAlign="center" variant="title2">
        메모 유형 선택
      </Typography>

      <YStack gap="$3">
        <Card pressStyle={{ scale: 0.98 }} onPress={handleSelectRatingMemo}>
          <XStack alignItems="center" gap="$3" padding="$4">
            <Star color="$textPrimary" size="$4" />
            <YStack flex={1} gap="$1">
              <Typography color="$textPrimary" variant="headline">
                메모
              </Typography>
              <Typography color="$textSecondary" variant="callout">
                경험에 대한 평점과 함께 메모를 작성합니다
              </Typography>
            </YStack>
          </XStack>
        </Card>

        <Card pressStyle={{ scale: 0.98 }} onPress={handleSelectTextMemo}>
          <XStack alignItems="center" gap="$3" padding="$4">
            <FileText color="$textPrimary" size="$4" />
            <YStack flex={1} gap="$1">
              <Typography color="$textPrimary" variant="headline">
                텍스트 메모
              </Typography>
              <Typography color="$textSecondary" variant="callout">
                간단한 텍스트로 메모를 작성합니다
              </Typography>
            </YStack>
          </XStack>
        </Card>
      </YStack>
    </YStack>
  );
}
