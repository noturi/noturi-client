import { Sheet, View, XStack, YStack } from 'tamagui';
import { HREFS } from '~/shared/config';
import { Typography } from '~/shared/ui';

import { router } from 'expo-router';

import { FileText, Star } from '@tamagui/lucide-icons';

interface MemoTypeSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoTypeSelectSheet = ({ isOpen, onClose }: MemoTypeSelectSheetProps) => {
  const handleSelectRatingMemo = () => {
    console.log('Rating memo clicked');
    onClose();
    setTimeout(() => {
      router.push(HREFS.memoCreate());
    }, 100);
  };

  const handleSelectTextMemo = () => {
    console.log('Text memo clicked');
    onClose();
    setTimeout(() => {
      router.push(HREFS.memoCreate());
    }, 100);
  };

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={[45]}
      snapPointsMode="percent"
      onOpenChange={onClose}
    >
      <Sheet.Overlay
        animation="quick"
        backgroundColor="$backgroundOverlay"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        <YStack alignItems="center" paddingBottom="$2" paddingTop="$2">
          <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
        </YStack>

        <YStack padding="$4">
          <YStack paddingBottom="$6">
            <Typography textAlign="center" variant="title2">
              어떤 메모를 작성할까요?
            </Typography>
            <Typography marginTop="$2" textAlign="center" variant="caption1">
              메모 타입을 선택하세요
            </Typography>
          </YStack>

          <YStack gap="$3">
            <XStack
              alignItems="center"
              backgroundColor="$backgroundSecondary"
              borderColor="$borderPrimary"
              borderRadius="$4"
              borderWidth={1}
              gap="$4"
              padding="$4"
              pressStyle={{
                backgroundColor: '$backgroundTertiary',
                transform: [{ scale: 0.98 }],
              }}
              onPress={handleSelectRatingMemo}
            >
              <View
                alignItems="center"
                backgroundColor="$primary"
                borderRadius="$3"
                justifyContent="center"
                padding="$3"
              >
                <Star color="white" fill="white" size="$6" />
              </View>
              <YStack flex={1}>
                <Typography variant="callout">별점 메모</Typography>
                <Typography marginTop="$1" variant="caption2">
                  별점과 함께 경험을 기록하세요
                </Typography>
              </YStack>
            </XStack>

            <XStack
              alignItems="center"
              backgroundColor="$backgroundSecondary"
              borderColor="$borderPrimary"
              borderRadius="$4"
              borderWidth={1}
              gap="$4"
              padding="$4"
              pressStyle={{
                backgroundColor: '$backgroundTertiary',
                transform: [{ scale: 0.98 }],
              }}
              onPress={handleSelectTextMemo}
            >
              <View
                alignItems="center"
                backgroundColor="$secondary"
                borderRadius="$3"
                justifyContent="center"
                padding="$3"
              >
                <FileText color="white" size="$6" />
              </View>
              <YStack flex={1}>
                <Typography variant="callout">일반 메모</Typography>
                <Typography marginTop="$1" variant="caption2">
                  자유롭게 생각을 기록하세요
                </Typography>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
