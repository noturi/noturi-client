import { Button, XStack, YStack } from 'tamagui';

import { Typography } from '@/components/ui';

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  return (
    <>
      {/* Handle */}
      <YStack alignItems="center" paddingBottom="$1" paddingTop="$2">
        <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
      </YStack>

      {/* Header */}
      <XStack
        alignItems="center"
        borderBottomColor="$border"
        borderBottomWidth={1}
        paddingHorizontal="$2"
        paddingVertical="$3"
        position="relative"
      >
        <Button
          backgroundColor="$backgroundTransparent"
          borderRadius="$4"
          borderWidth={0}
          color="$textSecondary"
          pressStyle={{ backgroundColor: '$backgroundTransparent' }}
          size="$3"
          onPress={onClose}
        >
          취소
        </Button>

        <Typography left={0} position="absolute" right={0} textAlign="center" variant="title">
          새 메모
        </Typography>
      </XStack>
    </>
  );
};
