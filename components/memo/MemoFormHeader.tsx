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
        justifyContent="space-between"
        paddingHorizontal="$2"
        paddingVertical="$3"
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
        <Typography variant="subheading">새 기록</Typography>
        <YStack width={60} />
      </XStack>
    </>
  );
};
